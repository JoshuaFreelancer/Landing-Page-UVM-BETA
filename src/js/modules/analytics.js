const STORAGE_KEY = "uvm_tracking_events";

function safeReadEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_error) {
    return [];
  }
}

function safeWriteEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-100)));
  } catch (_error) {
    // Ignore write errors in private mode or restricted storage.
  }
}

export function trackEvent(eventName, payload = {}) {
  const item = {
    event: eventName,
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
    ...payload,
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(item);

  const previous = safeReadEvents();
  previous.push(item);
  safeWriteEvents(previous);

  if (window.location.search.includes("debugTracking=1")) {
    console.info("[tracking]", item);
  }
}

export function initCTAEventTracking() {
  const clickable = document.querySelectorAll("[data-track]");
  clickable.forEach((element) => {
    element.addEventListener("click", () => {
      const variant = document.body.dataset.abVariant || "default";
      trackEvent("cta_click", {
        ctaId: element.getAttribute("data-track"),
        label: element.textContent?.trim() || "",
        variant,
      });
    });
  });
}
