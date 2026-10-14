# CausalFunnel — User Analytics Application


### Deployments

- Backend 
  - HTTPS: `https://13.201.186.251/`  [Self signed SSL certificate]
  - HTTP: `http://13.201.186.251:3000/`

- Analytics script
  - `https://int-analytics-12312.s3.ap-south-1.amazonaws.com/analytics.js`
  - To use the script add the following line to your webpage  
```html
<script src="https://int-analytics-12312.s3.ap-south-1.amazonaws.com/analytics.js"></script>
```

- Dashboard
- `https://causalfunnel-dashboard-sigma.vercel.app/`

```

Visitor browser                          Backend                          Dashboard
───────────────────────────────────────────────────────────────────────────────────────
┌──────────────────────────┐   POST      ┌──────────────────────┐   HTTP   ┌──────────────┐
│  Website (dummy/)        │ ──────────► │  Express API         │ ────────► │  Next.js     │
│  ┌────────────────────┐  │  /api/events│  (server/)           │           │  dashboard   │
│  │ analytics.js       │  │            │  ┌──────────────────┐ │           │  Sessions    │
│  │  page_view         │  │            │  │ MongoDB/Mongoose │ │◄──────────┤  + Heatmap   │
│  │  click (x, y)      │  │            │  └──────────────────┘ │   queries │  views       │
│  └────────────────────┘  │            └──────────────────────┘           └──────────────┘
└──────────────────────────┘
```
## Tech Stack

| Layer | Technology |
| --- | --- |
| **Tracking client** | Vanilla JavaScript (no build step, drop-in `<script>` tag) |
| **Backend** | Node.js, Express 5, Mongoose |
| **Database** | MongoDB |
| **Dashboard** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS |
| **Infra** | Docker + Docker Compose |

---

## 📁 Repository Layout

```
causalfunnel/
├── .env                     # Local env vars (SERVER_PORT, MONGODB_URI)
├── docker-compose.yaml      # server + dashboard + mongodb orchestration
├── scripts/
│   └── analytics.js         # ★ The browser tracking script (client SDK)
├── server/                  # ★ Express + Mongoose analytics API
├── dummy/                   # Demo website wired up to the tracker (for testing)
└── dashboard/               # Next.js dashboard (App Router)
```

---

## 🚀 Getting Started

### Option A — Docker Compose (one command)

> ⚠️ **Note on the current compose file:** the `server`, `dashboard`, and `mongodb` services are defined and will build/start, but the file does **not yet publish host ports or persist MongoDB data** (see [Trade-offs](#assumptions--trade-offs)). If you want to browse the dashboard, add `ports:` mappings (e.g. `"localhost:3000:3000"` for the server, `"localhost:3100:3000"` for the dashboard) and a named volume for `mongodb:/data/db`. This is currently tracked in `TODO` (`docker compose how to save and interact with db`).

```bash
docker compose up --build
```

- API + health: `http://localhost:3000` (once ports are mapped)
- Dashboard: `http://localhost:3100`

### Option B — Manual (recommended for development)

You'll need: **Node.js 18+**, a running **MongoDB** (local or Docker), and npm.

**1. Start MongoDB** (scratch container is easiest):
```bash
docker run -d --name mongo -p 27017:27017 mongo
```

**2. Start the backend**
```bash
cd server
npm install
cp ../.env.example .env   # if present; otherwise the server reads ../.env
npm start
```
The server reads `SERVER_PORT` and `MONGODB_URI` from the `.env` file at the **project root** (it loads `../.env`). Defaults: `http://localhost:3000`, `mongodb://localhost:27017/analytics`.

Verify it's up:
```bash
curl http://localhost:3000/health
```

**3. Run the tracking demo site**
The demo lives in `dummy/`. Serve it with any static server (e.g. VS Code Live Server or):
```bash
cd dummy
npx serve .
```
The demo page already includes the tracking snippet:
```html
<script src="../scripts/analytics.js"></script>
```
Load the page in a browser, click around, and events stream to the API.

**4. Run the dashboard**
```bash
cd dashboard
npm install
npm run dev
```
Open `http://localhost:3100`.

---

## Assumptions & Trade-offs

1. **Flat (single collection) storage.** All events — `page_view` and `click` — live in one `events` collection keyed by an indexed `session_id`. This keeps queries trivial for the required endpoints and lets us group by session on the fly with MongoDB aggregation. For a production system with much higher volume you'd probably separate page views/clicks, add TTL indexes, and maintain a `sessions` collection with precomputed counts. Chosen deliberately for simplicity at this scale.

2. **Session id generated client-side** via `crypto.randomUUID()`. No second-party cookies or server-side session tracking — deliberately privacy-friendly and simple to deploy. The demo script as committed regenerates the UUID per call with the `localStorage` persistence **commented out**; uncomment the `SESSION_KEY` block in `scripts/analytics.js` if you want the same visitor to map to one permanent session across reloads. This is a known finishing touch.

3. **Click coordinates are viewport-relative (`clientX`/`clientY`).** Heatmaps are rendered relative to the viewport size, which is standard for click-heatmaps, rather than page-absolute (scroll) coordinates. Fine for a fixed-height landing page; a scroll-offset adjustment would be needed for very long pages.

4. **No user identity / cookies.** Events are anonymous by design — only session grouping, no PII.

5. **Dashboard UI is scaffolded, not yet fully implemented.** All heatmap/session **API endpoints** are implemented and verified server-side; the Next.js dashboard shell is in place but the Sessions and Heatmap view components are the remaining work item.

6. **Docker Compose needs port/volume mapping.** The three services are wired up but the compose file doesn't publish host ports or persist MongoDB data yet (see the TODO). Development is currently most reliable via the manual route.

7. **No auth/rate-limiting.** This is an internal/internal-interview tool, so the ingest endpoint is open. A real deployment would add CORS allow-listing, an ingest token, and rate limiting.
