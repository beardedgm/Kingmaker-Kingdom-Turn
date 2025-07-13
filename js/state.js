import { LOCAL_STORAGE_KEY, DATA_VERSION, defaultKingdomData, KINGDOM_SKILLS } from "./constants.js";
import { safeOperation } from "./utils.js";
import { renderAll, showConfirmationModal } from "./rendering.js";
import { clearTurn } from "./turn.js";

// ==========================================
// DATA MIGRATION
// ==========================================

export const DataMigrations = {
  "1.0.0": (data) => {
    if (data.kingdom.leaders) {
      Object.values(data.kingdom.leaders).forEach((leader) => {
        if (typeof leader.status === "undefined") {
          leader.status = leader.isVacant ? "Vacant" : leader.isPlayer ? "PC" : "Hired";
          delete leader.isPlayer;
          delete leader.isVacant;
        }
      });
    }
    return data;
  },
  "1.1.0": (data) => {
    if (!data.turnData) {
      data.turnData = {};
    }
    return data;
  },
};

export function migrateData(savedData) {
  const currentVersion = savedData.version || "1.0.0";
  let data = savedData;
  const versions = Object.keys(DataMigrations).sort();
  const startIndex = versions.indexOf(currentVersion);

  for (let i = startIndex + 1; i < versions.length; i++) {
    const version = versions[i];
    data = DataMigrations[version](data);
    data.version = version;
  }
  return data;
}

// ==========================================
// ACCESSIBILITY
// ==========================================

export const A11yHelpers = {
  enhanceFormAccessibility: () => {
    document.querySelectorAll("input, select, textarea").forEach((input) => {
      const label = input.closest(".uk-margin")?.querySelector(".uk-form-label");
      if (label && !input.getAttribute("aria-label")) {
        input.setAttribute("aria-label", label.textContent);
      }
      if (input.dataset.key) {
        input.setAttribute("aria-describedby", `${input.dataset.key}-help`);
      }
    });
  },
  enhanceGridNavigation: () => {
    document.querySelectorAll(".grid-lot").forEach((lot, index, lots) => {
      lot.setAttribute("tabindex", "0");
      lot.setAttribute("role", "button");
      lot.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          lot.click();
        } else if (e.key === "ArrowRight" && lots[index + 1]) {
          lots[index + 1].focus();
        } else if (e.key === "ArrowLeft" && lots[index - 1]) {
          lots[index - 1].focus();
        }
      });
    });
  },
  announceStateChange: (message) => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.style.position = "absolute";
    announcement.style.left = "-10000px";
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  },
};

// ==========================================
// STATE MANAGEMENT
// ==========================================

export let kingdom = {};
export let turnData = {};
export let history = [];

export function setTurnData(newData) {
  turnData = newData;
}

export function generateDefaultAdvancement() {
  const advancement = {};
  for (let i = 2; i <= 20; i++) {
    advancement[`lvl${i}`] = {};
    if (i % 2 === 0) advancement[`lvl${i}`].feat = "";
    if (i % 5 === 0) advancement[`lvl${i}`].abilityBoosts = "";
    if (i >= 3 && i % 2 !== 0) advancement[`lvl${i}`].skillIncrease = "";
    if ([5, 8, 11, 14, 17].includes(i)) advancement[`lvl${i}`].ruinResistance = "";
  }
  return advancement;
}

export function generateDefaultSkills() {
  const skills = {};
  for (const skillName in KINGDOM_SKILLS) {
    skills[skillName] = { prof: 0, item: 0, status: 0, circ: 0, other: 0 };
  }
  return skills;
}

export function saveState() {
  return safeOperation(() => {
    const backup = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (backup) {
      localStorage.setItem(LOCAL_STORAGE_KEY + "_backup", backup);
    }
    const appState = { kingdom, history, turnData, version: DATA_VERSION };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appState));
    return true;
  }, "Failed to save kingdom data");
}

export function loadState() {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
        try {
            let appState = JSON.parse(savedState);
            if (!appState.version || appState.version !== DATA_VERSION) {
                appState = migrateData(appState);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appState));
                UIkit.notification({ message: "Kingdom data updated to latest version.", status: "primary" });
            }
            kingdom = appState.kingdom;
            history = appState.history || [];
            turnData = appState.turnData || {};

            // Ensure backward compatibility for core structures
            if (!kingdom.settlements) kingdom.settlements = [];
            if (!kingdom.armies) kingdom.armies = [];
            if (!kingdom.advancement) kingdom.advancement = generateDefaultAdvancement();
            if (!kingdom.skills) kingdom.skills = generateDefaultSkills();
            if (!kingdom.ruins) {
                kingdom.ruins = {
                    corruption: { points: 0, penalty: 0, threshold: 10 },
                    crime: { points: 0, penalty: 0, threshold: 10 },
                    decay: { points: 0, penalty: 0, threshold: 10 },
                    strife: { points: 0, penalty: 0, threshold: 10 },
                };
            }
        } catch (error) {
            console.error("Failed to load saved state:", error);
            showConfirmationModal("Failed to load saved data. Start with default kingdom?", initializeDefaultKingdom);
        }
    } else {
        initializeDefaultKingdom();
    }
}

export function initializeDefaultKingdom() {
  kingdom = JSON.parse(JSON.stringify(defaultKingdomData));
  kingdom.advancement = generateDefaultAdvancement();
  kingdom.skills = generateDefaultSkills();
  history = [];
  turnData = {};
  renderAll();
  clearTurn();
}

export function recoverFromBackup() {
  return safeOperation(() => {
    const backup = localStorage.getItem(LOCAL_STORAGE_KEY + "_backup");
    if (backup) {
      localStorage.setItem(LOCAL_STORAGE_KEY, backup);
      loadState();
      renderAll();
      UIkit.notification({ message: "Kingdom restored from backup", status: "success" });
      return true;
    }
    throw new Error("No backup available");
  }, "Failed to recover from backup");
}

export function exportState() {
    const dataStr = JSON.stringify({ kingdom, history, turnData, version: DATA_VERSION }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${kingdom.name || "kingdom"}-save.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    UIkit.notification({ message: "Save file exported.", status: "success" });
}

export function importState() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,application/json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        safeOperation(() => {
            const newState = JSON.parse(event.target.result);
            if (newState.kingdom && newState.history) {
                kingdom = newState.kingdom;
                history = newState.history;
                turnData = newState.turnData || {};
                // Re-run compatibility checks on imported data
                loadState(); 
                saveState();
                renderAll();
                clearTurn();
                UIkit.notification({ message: "Save file imported.", status: "success" });
            } else {
                throw new Error("Invalid save file format.");
            }
        }, "Error importing file");
    };
    reader.readAsText(file);
  };
  input.click();
}

export function resetKingdom() {
    showConfirmationModal("Are you sure? This will erase all progress.", () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LOCAL_STORAGE_KEY + "_backup");
        initializeDefaultKingdom();
        UIkit.notification({ message: "Kingdom has been reset.", status: "primary" });
    });
}

// ==========================================
