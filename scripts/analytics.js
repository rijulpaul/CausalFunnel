(function () {
  "use strict";

  // Replace this with your backend API endpoint
  const API_URL = "http://localhost:3001/api/events";

  const SESSION_KEY = "analytics_session_id";

  /**
   * Get the existing session ID or create a new one.
   */
  function getSessionId() {
    let sessionId = localStorage.getItem(SESSION_KEY);

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, sessionId);
    }

    return sessionId;

    // return crypto.randomUUID()
  }

  /**
   * Send an analytics event to the backend.
   */
  function sendEvent(eventType, data = {}) {
    const event = {
      session_id: getSessionId(),
      event: eventType,
      page_url: window.location.href,
      timestamp: new Date().toISOString(),
      ...data,
    };

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
      keepalive: true,
    }).catch(function (error) {
      console.error("Analytics error:", error);
    });
  }

  /**
   * Track page view.
   */
  function trackPageView() {
    sendEvent("page_view");
  }

  /**
   * Track clicks.
   *
   * x, y are screen resolution independent
   */
  function trackClick(event) {
    const element = event.target;

    if (!(element instanceof HTMLElement)) return;

    sendEvent("click", {
      tag: element.tagName.toLowerCase(),
      text: element.innerText?.trim() || "",
      href: element.href || "",
      x: event.clientX / innerWidth,
      y:
        (event.clientY + window.scrollY) /
        document.documentElement.scrollHeight,
    });
  }

  /**
   * Initialize analytics tracking.
   */
  function init() {
    // Track initial page view
    trackPageView();

    // Track all clicks on the page
    document.addEventListener("click", trackClick);
  }

  // Start tracking when the DOM is ready.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
