import { kingdom, turnData, history, saveState, loadState } from "./state.js";
import { renderAll, debouncedRenderAll } from "./rendering.js";
import { initEventListeners } from "./events.js";
import { clearTurn, calculateAndRenderCreationScores } from "./turn.js";
import { DATA_VERSION } from "./constants.js";

// ==========================================

export function setupAutoSave() {
  setInterval(() => {
    saveState();
  }, 30000); // Auto-save every 30 seconds
}

export function initializeApplication() {
  safeOperation(() => {
    console.log(`Initializing Kingdom Tracker v${DATA_VERSION}`);
    loadState();
    renderAll();
    clearTurn();
    initEventListeners();
    calculateAndRenderCreationScores(); // Initial call for creation tab
    setupAutoSave();
    window.addEventListener("beforeunload", saveState);

    if (kingdom.name === "Silverwood") {
      UIkit.notification({
        message: "Welcome! Visit the 'Creation & Advancement' tab to set up your kingdom.",
        status: "primary",
        timeout: 5000,
      });
    }
    console.log("Kingdom Tracker initialized successfully");
  }, "Failed to initialize Kingdom Tracker");
}

document.addEventListener("DOMContentLoaded", initializeApplication);

// ==========================================
// GLOBAL ERROR HANDLING & DEBUGGING
// ==========================================

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  UIkit.notification({ message: "An unexpected error occurred. Your data has been saved.", status: "danger" });
  saveState();
});

if (typeof window !== "undefined") {
  window.KingdomTracker = {
    kingdom, turnData, history, saveState,
    renderAll: debouncedRenderAll,
    version: DATA_VERSION,
  };
}
