"use strict";

import dotenv from "dotenv";
dotenv.config({path: "../.env"});

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/analytics";

app.use(cors());
app.use(express.json({ limit: "10kb" }));

// --------------------------------------------------
// MongoDB
// --------------------------------------------------

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });

// --------------------------------------------------
// Event Schema
// --------------------------------------------------

const eventSchema = new mongoose.Schema(
  {
    session_id: {
      type: String,
      required: true,
      index: true,
    },

    event: {
      type: String,
      required: true,
      enum: ["page_view", "click"],
      index: true,
    },

    page_url: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      required: true,
      index: true,
    },

    x: {
      type: Number,
    },

    y: {
      type: Number,
    },
    tag: {
      type: String
    },
    text: {
      type: String
    },
    href: {
      type: String
    }
  },
  {
    versionKey: false,
  },
);

const Event = mongoose.model("Event", eventSchema);

// --------------------------------------------------
// Health check
// --------------------------------------------------

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

// --------------------------------------------------
// 1. Receive and store event
// --------------------------------------------------

app.post("/api/events", async (req, res) => {
  try {
    const eventData = {
      session_id: req.body.session_id,
      event: req.body.event,
      page_url: req.body.page_url,
      timestamp: new Date(req.body.timestamp),
    };

    // Only store coordinates for click events.
    if (req.body.event === "click") {
      eventData.x = req.body.x;
      eventData.y = req.body.y;
      eventData.tag = req.body.tag;
      eventData.text = req.body.text;
      eventData.href = req.body.href;
    }

    const event = await Event.create(eventData);

    return res.status(201).json({
      success: true,
      event_id: event._id,
    });
  } catch (error) {
    console.error("Error storing event:", error);

    return res.status(500).json({
      error: "Failed to store event",
    });
  }
});

// --------------------------------------------------
// 2. Fetch sessions with event counts
// --------------------------------------------------

app.get("/api/sessions", async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: "$session_id",
          event_count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          session_id: "$_id",
          event_count: 1,
        },
      },
      {
        $sort: {
          event_count: -1,
        },
      },
    ]);

    return res.json({
      sessions,
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);

    return res.status(500).json({
      error: "Failed to fetch sessions",
    });
  }
});

app.get("/api/pages", async (req, res) => {
  try {
    const pages = await Event.aggregate([
      {
        $group: {
          _id: "$page_url",
          event_count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          page_url: "$_id",
          event_count: 1,
        },
      },
      {
        $sort: {
          event_count: -1,
        },
      },
    ]);

    return res.json({
      pages,
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);

    return res.status(500).json({
      error: "Failed to fetch sessions",
    });
  }
});

// --------------------------------------------------
// 3. Fetch all events for a specific session
// --------------------------------------------------

app.get("/api/sessions/:sessionId/events", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const events = await Event.find({
      session_id: sessionId,
    })
      .sort({ timestamp: -1 })
      .lean();

    return res.json({
      session_id: sessionId,
      event_count: events.length,
      events,
    });
  } catch (error) {
    console.error("Error fetching session events:", error);

    return res.status(500).json({
      error: "Failed to fetch session events",
    });
  }
});

// --------------------------------------------------
// 4. Fetch click data for a page
// --------------------------------------------------

app.get("/api/heatmap", async (req, res) => {
  try {
    const { page_url } = req.query;

    if (!page_url) {
      return res.status(400).json({
        error: "page_url query parameter is required",
      });
    }

    const clicks = await Event.find({
      event: "click",
      page_url,
    })
      .select({
        _id: 0,
        x: 1,
        y: 1,
        timestamp: 1,
        session_id: 1,
      })
      .sort({ timestamp: 1 })
      .lean();

    return res.json({
      page_url,
      click_count: clicks.length,
      clicks,
    });
  } catch (error) {
    console.error("Error fetching heatmap data:", error);

    return res.status(500).json({
      error: "Failed to fetch heatmap data",
    });
  }
});

// --------------------------------------------------
// Handle invalid JSON
// --------------------------------------------------

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400) {
    return res.status(400).json({
      error: "Invalid JSON",
    });
  }

  next(error);
});

// --------------------------------------------------
// Start server
// --------------------------------------------------

app.listen(SERVER_PORT, () => {
  console.log(`Analytics API running on http://localhost:${SERVER_PORT}`);
});
