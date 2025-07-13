// ==========================================
// KINGDOM TRACKER - COMPLETE JAVASCRIPT
// ==========================================

// ==========================================
// CONFIGURATION & CONSTANTS
// ==========================================

const LOCAL_STORAGE_KEY = "pf2eKingdomTrackerData";
const DATA_VERSION = "1.1.0"; // Note: Ensure migration logic matches version changes

const defaultKingdomData = {
  name: "Silverwood",
  level: 1,
  xp: 0,
  size: 1,
  farmlandHexes: 0,
  capital: "Stag's Rest",
  fame: 1,
  infamy: 0,
  unrest: 0,
  baseCulture: 10,
  baseEconomy: 10,
  baseLoyalty: 10,
  baseStability: 10,
  food: 5,
  lumber: 5,
  luxuries: 5,
  ore: 5,
  stone: 5,
  treasury: 10,
  ruins: {
    corruption: { points: 0, penalty: 0, threshold: 10 },
    crime: { points: 0, penalty: 0, threshold: 10 },
    decay: { points: 0, penalty: 0, threshold: 10 },
    strife: { points: 0, penalty: 0, threshold: 10 },
  },
  concept: "A frontier kingdom seeking to tame the wilds.",
  charter: "Conquest",
  heartland: "Forest",
  government: "Feudalism",
  eventCheckModifier: 0,
  resourceDice: 0,
  tradeAgreements: "",
  leaders: {
    ruler: { name: "Queen Anya", isInvested: true, status: "PC" },
    counselor: { name: "Elara", isInvested: true, status: "NPC" },
    general: { name: "Garrus", isInvested: true, status: "Hired" },
    emissary: { name: "Lysandra", isInvested: false, status: "Hired" },
    magister: { name: "Zeke", isInvested: false, status: "Hired" },
    treasurer: { name: "", isInvested: false, status: "Vacant" },
    viceroy: { name: "", isInvested: false, status: "Vacant" },
    warden: { name: "", isInvested: false, status: "Vacant" },
  },
  settlements: [],
  armies: [],
  advancement: {},
  skills: {},
};

const KINGDOM_SKILLS = {
  Agriculture: "stability",
  Arts: "culture",
  Boating: "economy",
  Defense: "stability",
  Engineering: "stability",
  Exploration: "economy",
  Folklore: "culture",
  Industry: "economy",
  Intrigue: "loyalty",
  Magic: "culture",
  Politics: "loyalty",
  Scholarship: "culture",
  Statecraft: "loyalty",
  Trade: "economy",
  Warfare: "loyalty",
  Wilderness: "stability",
};

const KINGDOM_ACTIVITIES = {
  commerce: [
    "Collect Taxes",
    "Improve Lifestyle",
    "Tap Treasury",
    "Trade Commodities",
    "Manage Trade Agreements",
  ],
  leadership: [
    "Capital Investment",
    "Celebrate Holiday",
    "Clandestine Business",
    "Craft Luxuries",
    "Create a Masterpiece",
    "Creative Solution",
    "Establish Trade Agreement",
    "Focused Attention",
    "Hire Adventurers",
    "Infiltration",
    "Pledge of Fealty",
    "Prognostication",
    "Provide Care",
    "Purchase Commodities",
    "Quell Unrest",
    "Recruit Army",
    "Relocate Capital",
    "Repair Reputation",
    "Request Foreign Aid",
    "Rest and Relax",
    "Send Diplomatic Envoy",
    "Supernatural Solution",
  ],
  region: [
    "Abandon Hex",
    "Build Roads",
    "Claim Hex",
    "Clear Hex",
    "Establish Farmland",
    "Establish Settlement",
    "Establish Work Site",
    "Fortify Hex",
    "Go Fishing",
    "Gather Livestock",
    "Harvest Crops",
    "Irrigation",
  ],
  civic: ["Build Structure", "Demolish"],
};

const RANDOM_KINGDOM_EVENTS = [
    { min: 1, max: 3, name: "Archaeological Find" },
    { min: 4, max: 5, name: "Assassination Attempt" },
    { min: 6, max: 7, name: "Bandit Activity" },
    { min: 8, max: 10, name: "Boomtown" },
    { min: 11, max: 14, name: "Building Demand" },
    { min: 15, max: 17, name: "Crop Failure" },
    { min: 18, max: 19, name: "Cult Activity" },
    { min: 20, max: 22, name: "Diplomatic Overture" },
    { min: 23, max: 25, name: "Discovery" },
    { min: 26, max: 27, name: "Drug Den" },
    { min: 28, max: 28, name: "Economic Surge" },
    { min: 29, max: 31, name: "Expansion Demand" },
    { min: 32, max: 34, name: "Festive Invitation" },
    { min: 35, max: 37, name: "Feud" },
    { min: 38, max: 39, name: "Food Shortage" },
    { min: 40, max: 42, name: "Food Surplus" },
    { min: 43, max: 44, name: "Good Weather" },
    { min: 45, max: 46, name: "Inquisition" },
    { min: 47, max: 49, name: "Justice Prevails" },
    { min: 50, max: 51, name: "Land Rush" },
    { min: 52, max: 54, name: "Local Disaster" },
    { min: 55, max: 57, name: "Monster Activity" },
    { min: 58, max: 58, name: "Natural Disaster" },
    { min: 59, max: 61, name: "Nature's Blessing" },
    { min: 62, max: 64, name: "New Subjects" },
    { min: 65, max: 67, name: "Noblesse Oblige" },
    { min: 68, max: 70, name: "Outstanding Success" },
    { min: 71, max: 72, name: "Pilgrimage" },
    { min: 73, max: 74, name: "Plague" },
    { min: 75, max: 78, name: "Political Calm" },
    { min: 79, max: 81, name: "Public Scandal" },
    { min: 82, max: 82, name: "Remarkable Treasure" },
    { min: 83, max: 83, name: "Sacrifices" },
    { min: 84, max: 85, name: "Sensational Crime" },
    { min: 86, max: 90, name: "Squatters" },
    { min: 91, max: 92, name: "Undead Uprising" },
    { min: 93, max: 95, name: "Unexpected Find" },
    { min: 96, max: 97, name: "Vandals" },
    { min: 98, max: 99, name: "Visiting Celebrity" },
    { min: 100, max: 100, name: "Wealthy Immigrant" }
];

const KINGDOM_FEATS = [
    { name: "Civil Service", level: 1, prereq: null, description: "Vacancy penalty for one leadership role is no longer applicable." },
    { name: "Cooperative Leadership", level: 1, prereq: null, description: "Leaders gain increased bonuses when aiding each other." },
    { name: "Crush Dissent", level: 1, prereq: { skill: "Warfare", rank: 1 }, description: "Use Warfare to cancel an Unrest increase." },
    { name: "Fortified Fiefs", level: 1, prereq: { skill: "Defense", rank: 1 }, description: "Gain bonuses to Fortify Hex and build defensive structures." },
    { name: "Insider Trading", level: 1, prereq: { skill: "Industry", rank: 1 }, description: "Gain bonuses to several Industry and Trade activities." },
    { name: "Kingdom Assurance", level: 1, prereq: { trainedSkills: 3 }, description: "Once per turn, take a fixed result of 10+prof on a chosen skill check." },
    { name: "Muddle Through", level: 1, prereq: { skill: "Wilderness", rank: 1 }, description: "Increase your Ruin thresholds, making them accumulate slower." },
    { name: "Practical Magic", level: 1, prereq: { skill: "Magic", rank: 1 }, description: "Use Magic instead of Engineering for some checks; reduce Hire Adventurers cost." },
    { name: "Pull Together", level: 1, prereq: { skill: "Politics", rank: 1 }, description: "Once per turn, attempt a flat check to turn a critical failure into a regular failure." },
    { name: "Skill Training", level: 1, prereq: null, description: "Become trained in a Kingdom skill of your choice." },
    { name: "Endure Anarchy", level: 3, prereq: { ability: "Loyalty", value: 14 }, description: "Recover from Unrest faster and fall into anarchy at a higher Unrest value." },
    { name: "Inspiring Entertainment", level: 3, prereq: { ability: "Culture", value: 14 }, description: "Use Culture-based checks to manage Unrest and gain bonuses while Unrest is high." },
    { name: "Liquidate Resources", level: 3, prereq: { ability: "Economy", value: 14 }, description: "Once per turn, avoid spending RP from a failed check at a cost to future turns." },
    { name: "Quick Recovery", level: 3, prereq: { ability: "Stability", value: 14 }, description: "Gain a +4 bonus to checks to end ongoing harmful kingdom events." },
    { name: "Free and Fair", level: 7, prereq: null, description: "Gain bonuses to New Leadership and Pledge of Fealty activities." },
    { name: "Quality of Life", level: 7, prereq: null, description: "Reduce cost of living and increase availability of magic items in settlements." },
    { name: "Fame and Fortune", level: 11, prereq: null, description: "Gain bonus Resource Dice on critical successes during the Activity phase." }
];

const PROFICIENCY_RANKS = [
  "Untrained",
  "Trained",
  "Expert",
  "Master",
  "Legendary",
];

const KINGDOM_CHARTERS = {
  conquest: { name: "Conquest", boosts: ["loyalty", "free"], flaw: "culture" },
  expansion: {
    name: "Expansion",
    boosts: ["culture", "free"],
    flaw: "stability",
  },
  exploration: {
    name: "Exploration",
    boosts: ["stability", "free"],
    flaw: "economy",
  },
  grant: { name: "Grant", boosts: ["economy", "free"], flaw: "loyalty" },
  open: { name: "Open", boosts: ["free"], flaw: null },
};

const KINGDOM_HEARTLANDS = {
  forest_swamp: { name: "Forest or Swamp", boost: "culture" },
  hill_plain: { name: "Hill or Plain", boost: "loyalty" },
  lake_river: { name: "Lake or River", boost: "economy" },
  mountain_ruins: { name: "Mountain or Ruins", boost: "stability" },
};

const KINGDOM_GOVERNMENTS = {
  despotism: {
    name: "Despotism",
    boosts: ["stability", "economy", "free"],
    skills: ["Intrigue", "Warfare"],
    feat: "Crush Dissent",
  },
  feudalism: {
    name: "Feudalism",
    boosts: ["stability", "culture", "free"],
    skills: ["Defense", "Trade"],
    feat: "Fortified Fiefs",
  },
  oligarchy: {
    name: "Oligarchy",
    boosts: ["loyalty", "economy", "free"],
    skills: ["Arts", "Industry"],
    feat: "Insider Trading",
  },
  republic: {
    name: "Republic",
    boosts: ["stability", "loyalty", "free"],
    skills: ["Engineering", "Politics"],
    feat: "Pull Together",
  },
  thaumocracy: {
    name: "Thaumocracy",
    boosts: ["economy", "culture", "free"],
    skills: ["Folklore", "Magic"],
    feat: "Practical Magic",
  },
  yeomanry: {
    name: "Yeomanry",
    boosts: ["loyalty", "culture", "free"],
    skills: ["Agriculture", "Wilderness"],
    feat: "Muddle Through",
  },
};

const KINGDOM_ADVANCEMENT_TABLE = [
  { level: 1, dc: 14 }, { level: 2, dc: 15 }, { level: 3, dc: 16 },
  { level: 4, dc: 18 }, { level: 5, dc: 20 }, { level: 6, dc: 22 },
  { level: 7, dc: 23 }, { level: 8, dc: 24 }, { level: 9, dc: 26 },
  { level: 10, dc: 27 }, { level: 11, dc: 28 }, { level: 12, dc: 30 },
  { level: 13, dc: 31 }, { level: 14, dc: 32 }, { level: 15, dc: 34 },
  { level: 16, dc: 35 }, { level: 17, dc: 36 }, { level: 18, dc: 38 },
  { level: 19, dc: 39 }, { level: 20, dc: 40 },
];

const KINGDOM_SIZE_TABLE = [
  { min: 1, max: 9, mod: 0, die: 4, storage: 4 },
  { min: 10, max: 24, mod: 1, die: 6, storage: 8 },
  { min: 25, max: 49, mod: 2, die: 8, storage: 12 },
  { min: 50, max: 99, mod: 3, die: 10, storage: 16 },
  { min: 100, max: Infinity, mod: 4, die: 12, storage: 20 },
];

const structureColors = {
  Residential: "#dcedc8", Infrastructure: "#b3e5fc",
  Commercial: "#fff9c4", Government: "#cfd8dc",
  Defensive: "#ffcdd2", Industrial: "#d7ccc8",
  Magical: "#e1bee7", Demolish: "#ef5350",
};

// In script.js, replace the existing constant with this:

const availableStructures = [
    // Demolition
    { name: "Clear Lot", lots: [1, 1], category: "Demolish", cost: 1, description: "Clear a built lot, making it available for a new structure." },

    // Residential
    { name: "House", lots: [1, 1], category: "Residential", cost: 2, tags: ['Residential'], description: "Simple housing for your citizens." },
    { name: "Tenement", lots: [2, 1], category: "Residential", cost: 4, bonuses: { stability: -1 }, tags: ['Residential'], description: "Large, multi-family housing." },
    { name: "Mansion", lots: [2, 2], category: "Residential", cost: 10, bonuses: { loyalty: 1 }, tags: ['Residential'], description: "A large, opulent home." },
    { name: "Noble Villa", lots: [2, 2], category: "Residential", cost: 30, bonuses: { culture: 1, loyalty: 2 }, tags: ['Residential'], description: "An estate for a noble, increasing loyalty and culture." },
    
    // Government
    { name: "Town Hall", lots: [2, 2], category: "Government", cost: 22, bonuses: { loyalty: 1, economy: 1 }, description: "The center of your settlement's administration." },
    { name: "Garrison", lots: [2, 2], category: "Government", cost: 30, bonuses: { stability: 2 }, tags: ['Residential'], description: "Houses soldiers, increasing stability." },
    { name: "Castle", lots: [4, 4], category: "Government", cost: 54, bonuses: { defense: 10, loyalty: 2, stability: 2 }, tags: ['Residential'], description: "A mighty fortress that serves as a symbol of power." },
    
    // Commercial
    { name: "Shop", lots: [1, 1], category: "Commercial", cost: 8, bonuses: { economy: 1 }, description: "A place for local commerce." },
    { name: "Tavern", lots: [1, 1], category: "Commercial", cost: 10, bonuses: { loyalty: 1, stability: -1 }, description: "A place for your citizens to socialize." },
    { name: "Marketplace", lots: [2, 2], category: "Commercial", cost: 48, bonuses: { economy: 1, stability: 1 }, description: "A large, open-air market for trade." },
    { name: "Bank", lots: [1, 1], category: "Commercial", cost: 28, bonuses: { economy: 2 }, description: "Provides financial services and increases economic stability." },

    // Industrial
    { name: "Granary", lots: [1, 1], category: "Industrial", cost: 16, bonuses: { food: 1 }, description: "Stores excess food, protecting against shortages." },
    { name: "Sawmill", lots: [2, 2], category: "Industrial", cost: 12, bonuses: { lumber: 1 }, description: "Processes timber into usable lumber." },
    { name: "Mine", lots: [2, 2], category: "Industrial", cost: 12, bonuses: { ore: 1 }, description: "Extracts ore from the ground." },
    { name: "Quarry", lots: [2, 2], category: "Industrial", cost: 12, bonuses: { stone: 1 }, description: "Extracts stone from the ground." },
    { name: "Smithy", lots: [1, 1], category: "Industrial", cost: 8, bonuses: { stability: 1 }, description: "Provides essential metal goods and repairs." },
    { name: "Mill", lots: [2, 2], category: "Industrial", cost: 12, description: "Reduces a settlement's Food consumption by 1." },
    { name: "Stockyard", lots: [2, 2], category: "Industrial", cost: 40, description: "Reduces a settlement's Food consumption by 2." },

    // Infrastructure
    { name: "Bridge", lots: [2, 1], category: "Infrastructure", cost: 6, description: "Allows for easier travel over rivers." },
    { name: "Sewer System", lots: [4, 4], category: "Infrastructure", cost: 24, bonuses: { stability: 1 }, description: "Improves sanitation and public health." },
    { name: "Watchtower", lots: [1, 1], category: "Infrastructure", cost: 12, bonuses: { stability: 1, defense: 2 }, description: "Provides an early warning against threats." },

    // Magical
    { name: "Temple", lots: [2, 2], category: "Magical", cost: 32, bonuses: { loyalty: 2, stability: 2 }, description: "A center of faith and community." },
    { name: "Magic Shop", lots: [1, 1], category: "Magical", cost: 38, bonuses: { economy: 1, culture: 1 }, description: "Sells magical goods and services." },
    { name: "Alchemist's Laboratory", lots: [1, 1], category: "Magical", cost: 18, bonuses: { economy: 1 }, tags: ['Magic'], description: "Produces alchemical items." },
    { name: "Wizard's Tower", lots: [2, 2], category: "Magical", cost: 32, bonuses: { defense: 4 }, tags: ['Magic'], description: "A place of magical research and power." },
    
    // Defensive
    { name: "Wooden Wall", lots: [1, 1], category: "Defensive", cost: 2, bonuses: { defense: 1 }, description: "A simple defensive perimeter." },
    { name: "Stone Wall", lots: [1, 1], category: "Defensive", cost: 4, bonuses: { defense: 2 }, description: "A sturdy defensive perimeter." }
];

// ==========================================
// VALIDATION & UTILITIES
// ==========================================

const Validators = {
  isPositiveInteger: (value) => Number.isInteger(value) && value >= 0,
  isValidRange: (value, min, max) => value >= min && value <= max,
  isNotEmpty: (value) => value && value.toString().trim().length > 0,
  isLength: (value, max) => value.length <= max,

  validateKingdomName: (name) => {
    if (!Validators.isNotEmpty(name)) throw new Error("Kingdom name cannot be empty.");
    if (!Validators.isLength(name, 50)) throw new Error("Kingdom name must be 50 characters or less.");
    return true;
  },
  validateLevel: (level) => {
    if (!Validators.isPositiveInteger(level)) throw new Error("Level must be a positive integer.");
    if (!Validators.isValidRange(level, 1, 20)) throw new Error("Level must be between 1 and 20.");
    return true;
  },
  validateResource: (value, resourceName) => {
    if (!Number.isInteger(value)) throw new Error(`${resourceName} must be a whole number.`);
    if (value < 0) throw new Error(`${resourceName} cannot be negative.`);
    return true;
  },
};

function safeOperation(operation, errorMessage = "An error occurred") {
  try {
    return operation();
  } catch (error) {
    console.error(errorMessage, error);
    UIkit.notification({
      message: `${errorMessage}: ${error.message}`,
      status: "danger",
      pos: "top-center",
      timeout: 5000,
    });
    return null;
  }
}

function handleValidatedInput(element, validator, onSuccess) {
  try {
    const value = element.type === "number" ? parseInt(element.value, 10) : element.value;
    if (validator(value)) {
      onSuccess(value);
    }
  } catch (error) {
    UIkit.notification({ message: error.message, status: "danger", pos: "top-center" });
    element.classList.add("uk-form-danger");
    setTimeout(() => element.classList.remove("uk-form-danger"), 3000);
  }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==========================================
// DATA MIGRATION
// ==========================================

const DataMigrations = {
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

function migrateData(savedData) {
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

const A11yHelpers = {
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

let kingdom = {};
let turnData = {};
let history = [];

function generateDefaultAdvancement() {
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

function generateDefaultSkills() {
  const skills = {};
  for (const skillName in KINGDOM_SKILLS) {
    skills[skillName] = { prof: 0, item: 0, status: 0, circ: 0, other: 0 };
  }
  return skills;
}

function saveState() {
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

function loadState() {
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

function initializeDefaultKingdom() {
  kingdom = JSON.parse(JSON.stringify(defaultKingdomData));
  kingdom.advancement = generateDefaultAdvancement();
  kingdom.skills = generateDefaultSkills();
  history = [];
  turnData = {};
  renderAll();
  clearTurn();
}

function recoverFromBackup() {
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

function exportState() {
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

function importState() {
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

function resetKingdom() {
    showConfirmationModal("Are you sure? This will erase all progress.", () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LOCAL_STORAGE_KEY + "_backup");
        initializeDefaultKingdom();
        UIkit.notification({ message: "Kingdom has been reset.", status: "primary" });
    });
}

// ==========================================
// CALCULATIONS
// ==========================================

function calculateStructureBonuses() {
  const bonuses = { culture: 0, economy: 0, loyalty: 0, stability: 0, food: 0, lumber: 0, luxuries: 0, ore: 0, stone: 0 };
  if (!kingdom.settlements) return bonuses;
  kingdom.settlements.forEach(settlement => {
    settlement.lots.forEach(lot => {
      if (lot.isOrigin && lot.structureName) {
        const structure = availableStructures.find(s => s.name === lot.structureName);
        if (structure?.bonuses) {
          for (const [key, value] of Object.entries(structure.bonuses)) {
            bonuses[key] = (bonuses[key] || 0) + value;
          }
        }
      }
    });
  });
  return bonuses;
}

function calculateConsumption() {
  let totalConsumption = 0;
  kingdom.settlements.forEach(settlement => {
    const builtBlocks = new Set(settlement.lots.filter(l => l.structureName).map(l => Math.floor(l.lotIndex / 4))).size;
    let settlementBaseConsumption = 1; // Village
    if (builtBlocks >= 9) settlementBaseConsumption = 6; // Metropolis
    else if (builtBlocks >= 4) settlementBaseConsumption = 4; // City
    else if (builtBlocks >= 2) settlementBaseConsumption = 2; // Town
    
    let settlementConsumption = settlementBaseConsumption;
    if (settlement.lots.some(l => l.structureName === "Mill")) settlementConsumption--;
    if (settlement.lots.some(l => l.structureName === "Stockyard")) settlementConsumption--;
    totalConsumption += Math.max(0, settlementConsumption);
  });
  
  totalConsumption += kingdom.armies.reduce((total, army) => total + (army.consumption || 0), 0);
  totalConsumption -= kingdom.farmlandHexes || 0;
  totalConsumption += turnData.turnConsumptionModifier || 0;
  return { food: Math.max(0, totalConsumption) };
}

function getAbilityModifier(score) {
  return Math.floor((score - 10) / 2);
}

function calculateSkillModifiers() {
  const skillData = JSON.parse(JSON.stringify(kingdom.skills));
  const bonuses = calculateStructureBonuses();
  
  for (const skillName in skillData) {
    if (!skillData[skillName].prof) skillData[skillName].prof = 0;
  }
  
  for (let i = 2; i <= kingdom.level; i++) {
    const skillName = kingdom.advancement[`lvl${i}`]?.skillIncrease;
    if (skillName && skillData[skillName] && skillData[skillName].prof < PROFICIENCY_RANKS.length - 1) {
      skillData[skillName].prof++;
    }
  }
  
  const finalMods = {};
  for (const skillName in skillData) {
    const skill = skillData[skillName];
    const ability = KINGDOM_SKILLS[skillName];
    const abilityScore = kingdom[`base${ability.charAt(0).toUpperCase() + ability.slice(1)}`] + (bonuses[ability] || 0);
    const abilityMod = getAbilityModifier(abilityScore);
    const profBonus = skill.prof > 0 ? kingdom.level + skill.prof * 2 : 0;

    const ruinMap = { culture: "corruption", economy: "crime", loyalty: "strife", stability: "decay" };
    const ruinPenalty = kingdom.ruins[ruinMap[ability]]?.penalty || 0;

    const turnCircumstanceBonus = turnData[`turn${ability.charAt(0).toUpperCase() + ability.slice(1)}CircumstanceBonus`] || 0;
    const totalCirc = (skill.circ || 0) + turnCircumstanceBonus + (turnData.turnGenericCircumstanceBonus || 0);
    
    finalMods[skillName] = abilityMod + profBonus + (skill.item || 0) - ruinPenalty + (skill.status || 0) + totalCirc + (skill.other || 0);
  }
  return finalMods;
}

function calculateControlDC() {
  const levelDC = KINGDOM_ADVANCEMENT_TABLE.find(row => row.level === kingdom.level)?.dc || 14;
  const sizeMod = KINGDOM_SIZE_TABLE.find(row => kingdom.size >= row.min && kingdom.size <= row.max)?.mod || 0;
  return levelDC + sizeMod;
}

function checkFeatPrerequisites(feat) {
    if (!feat.prereq) return true; // No prerequisite

    if (feat.prereq.skill) {
        return kingdom.skills[feat.prereq.skill]?.prof >= feat.prereq.rank;
    }
    if (feat.prereq.ability) {
        const bonuses = calculateStructureBonuses();
        const abilityScore = kingdom[`base${feat.prereq.ability.charAt(0).toUpperCase() + feat.prereq.ability.slice(1)}`] + (bonuses[feat.prereq.ability] || 0);
        return abilityScore >= feat.prereq.value;
    }
    if (feat.prereq.trainedSkills) {
        const trainedCount = Object.values(kingdom.skills).filter(s => s.prof >= 1).length;
        return trainedCount >= feat.prereq.trainedSkills;
    }
    return true;
}

function updateRuin(ruinType, amount) {
  if (!kingdom.ruins[ruinType] || amount === 0) return;
  const ruin = kingdom.ruins[ruinType];
  ruin.points += amount;
  while (ruin.points >= ruin.threshold) {
    ruin.penalty++;
    ruin.points -= ruin.threshold;
    UIkit.notification({
      message: `<span uk-icon='icon: warning'></span> ${ruinType.charAt(0).toUpperCase() + ruinType.slice(1)} penalty has increased to ${ruin.penalty}!`,
      status: "danger",
    });
  }
  if (ruin.points < 0) ruin.points = 0;
}

function isSettlementOvercrowded(settlement) {
    const residentialLots = settlement.lots.filter(lot => {
        if (!lot.structureName) return false;
        // Find the structure in our master list
        const structure = availableStructures.find(s => s.name === lot.structureName);
        // Check if the structure has the 'Residential' tag
        return structure && structure.tags && structure.tags.includes('Residential');
    }).length;
    
    const builtBlocks = new Set(
        settlement.lots.filter(l => l.structureName).map(l => Math.floor(l.lotIndex / 4))
    ).size;

    // A settlement is overcrowded if it has fewer residential lots than active blocks
    return residentialLots < builtBlocks;
}

// ==========================================
// RENDERING
// ==========================================

function renderSpecific(sections = []) {
  const renderMap = {
    kingdom: renderKingdomSheet,
    skills: renderSkillsAndFeats,
    history: renderHistory,
    tracker: renderTurnTracker,
    settlements: renderSettlements,
    armies: renderArmies,
    creation: renderCreation,
    save: renderSaveManagement,
  };
  const sectionsToRender = sections.length === 0 ? Object.keys(renderMap) : sections;
  sectionsToRender.forEach(section => renderMap[section]?.());
  setTimeout(() => {
    A11yHelpers.enhanceFormAccessibility();
    A11yHelpers.enhanceGridNavigation();
  }, 100);
}

const debouncedRenderAll = debounce(renderAll, 150);
function renderAll() {
  renderSpecific();
}

// In script.js
function renderKingdomSheet() {
    const container = document.getElementById("kingdom-sheet-content");
    const bonuses = calculateStructureBonuses();
    const controlDC = calculateControlDC();

    // Conditionally show the Level Up button if requirements are met
    let levelUpHtml = '';
    if (kingdom.xp >= 1000) {
        levelUpHtml = `
            <div class="uk-alert-success" uk-alert>
                <p class="uk-text-center">You have enough XP to advance to the next level!</p>
                <button class="uk-button uk-button-primary uk-width-1-1" id="kingdom-level-up-btn">Level Up Kingdom!</button>
            </div>`;
    }

    // Helper to generate description list items
    const generateDescriptionList = (items) => {
        return items.map(item => `<dt class="uk-text-capitalize">${item.label}</dt><dd>${item.value}</dd>`).join('');
    };

    // Prepare data for rendering
    const coreStats = ["culture", "economy", "loyalty", "stability"].map(stat => ({
        label: stat,
        value: `${kingdom[`base${stat.charAt(0).toUpperCase() + stat.slice(1)}`] + (bonuses[stat] || 0)} <span class="bonus-text">(${kingdom[`base${stat.charAt(0).toUpperCase() + stat.slice(1)}`]} ${bonuses[stat] >= 0 ? '+' : ''} ${bonuses[stat]})</span>`
    }));

    const otherStats = [
        { label: "Capital", value: kingdom.capital },
        { label: "Control DC", value: controlDC },
        ...coreStats,
        ...["unrest", "fame", "infamy", "xp"].map(stat => ({ label: stat, value: kingdom[stat] }))
    ];

    const ruinStats = Object.entries(kingdom.ruins).map(([type, ruin]) => ({
        label: type,
        value: `${ruin.points}/${ruin.threshold} (Penalty: -${ruin.penalty})`
    }));

    const resources = ["treasury", "food", "lumber", "luxuries", "ore", "stone"];
    const resourceHtml = resources.map(res => {
        const bonus = bonuses[res] || 0;
        return `<div class="resource-item">
            <span class="resource-label uk-text-capitalize">${res === "treasury" ? "Treasury (RP)" : res}: ${kingdom[res] + bonus}</span>
            <button class="uk-button uk-button-default uk-button-small" data-resource="${res}" data-action="decrease">-</button>
            <input class="uk-input uk-form-width-small uk-form-small" type="number" data-resource="${res}" value="${kingdom[res]}">
            <button class="uk-button uk-button-default uk-button-small" data-resource="${res}" data-action="increase">+</button>
        </div>`;
    }).join('');

    const leadersHtml = Object.entries(kingdom.leaders).map(([role, leader]) => {
        let statusBadge = '';
        if (leader.status === "PC") statusBadge = '<span class="uk-badge" style="background-color: #1e87f0; color: white;">PLAYER</span>';
        else if (leader.status === "NPC") statusBadge = '<span class="uk-badge" style="background-color: #32d296; color: white;">NPC</span>';
        else if (leader.status === "Vacant") statusBadge = '<span class="uk-badge uk-background-muted">VACANT</span>';
        if (leader.isInvested && leader.status !== "Vacant") statusBadge += ' <span class="uk-badge" style="background-color: #666; color: white;">INVESTED</span>';

        return `<div class="uk-card uk-card-default uk-card-body uk-card-small leader-card uk-position-relative">
            <button class="uk-position-top-right uk-margin-small-top uk-margin-small-right" uk-icon="pencil" data-role="${role}"></button>
            <h5 class="uk-card-title uk-margin-remove-bottom uk-text-capitalize">${role}</h5>
            <p class="uk-text-meta uk-margin-remove-top">${leader.name || "<i>Unassigned</i>"}</p>
            <div>${statusBadge}</div>
        </div>`;
    }).join('');

    // Set the final HTML
    container.innerHTML = `
        <h3 class="uk-card-title">${kingdom.name} (Level ${kingdom.level})</h3>
        ${levelUpHtml}
        <div class="uk-grid-divider" uk-grid>
            <div class="uk-width-1-2@m">
                <h4>Core Stats</h4>
                <dl class="uk-description-list uk-description-list-divider">${generateDescriptionList(otherStats)}</dl>
                <h4>Ruin</h4>
                <dl class="uk-description-list uk-description-list-divider">${generateDescriptionList(ruinStats)}</dl>
                <hr><h4>Misc</h4>
                <label class="uk-form-label">Resource Dice</label>
                <input class="uk-input" type="number" data-key="resourceDice" value="${kingdom.resourceDice || 0}">
                <label class="uk-form-label uk-margin-top">Trade Agreements</label>
                <textarea class="uk-textarea" rows="3" data-key="tradeAgreements">${kingdom.tradeAgreements || ""}</textarea>
            </div>
            <div class="uk-width-1-2@m">
                <h4>Resources</h4>
                <div id="resource-section">${resourceHtml}</div>
                <hr><h4>Leaders</h4>${leadersHtml}
            </div>
        </div>`;
}

function renderSkillsAndFeats() {
  const container = document.getElementById("skills-feats-content");
  const skillMods = calculateSkillModifiers();

  const featsHtml = "<ul>" + Object.entries(kingdom.advancement).map(([levelKey, adv]) => {
      if (!adv.feat) return '';
      const level = levelKey.replace('lvl', '');
      return `<li><b>Lvl ${level}:</b> ${adv.feat} ${adv.featOption ? `(${adv.featOption})` : ''}</li>`;
  }).join('') + "</ul>";

  const abilitiesHtml = "<ul>" + Object.entries(kingdom.advancement).map(([levelKey, adv]) => {
      if (!adv.abilityBoosts) return '';
      const level = levelKey.replace('lvl', '');
      return `<li><b>Lvl ${level}:</b> ${adv.abilityBoosts}</li>`;
  }).join('') + "</ul>";

  const skillsHtml = `<table class="uk-table uk-table-small uk-table-divider skills-table">
    <thead><tr><th>Skill</th><th>Ability</th><th>Total</th><th>Prof</th></tr></thead>
    <tbody>${Object.entries(kingdom.skills).map(([skillName, skill]) => `
      <tr>
        <td class="skill-name">${skillName}</td>
        <td>${KINGDOM_SKILLS[skillName].charAt(0).toUpperCase()}</td>
        <td>${skillMods[skillName] >= 0 ? "+" : ""}${skillMods[skillName]}</td>
        <td>${PROFICIENCY_RANKS[skill.prof]}</td>
      </tr>`).join('')}
    </tbody></table>`;

  container.innerHTML = `
    <div class="uk-grid-divider" uk-grid>
        <div class="uk-width-1-2@m"><h3 class="uk-card-title">Skills</h3>${skillsHtml}</div>
        <div class="uk-width-1-2@m">
            <h3 class="uk-card-title">Feats</h3>${featsHtml}<hr>
            <h3 class="uk-card-title">Abilities</h3>${abilitiesHtml}
        </div>
    </div>`;
}

function renderTurnTracker() {
    const container = document.getElementById("turn-tracker-content");

    // --- Upkeep Phase UI ---
    const sizeData = KINGDOM_SIZE_TABLE.find(row => kingdom.size >= row.min && kingdom.size <= row.max) || KINGDOM_SIZE_TABLE[0];
    const numDice = kingdom.level + 4 + (turnData.turnBonusResourceDice || 0) - (turnData.turnPenaltyResourceDice || 0);
    const consumption = calculateConsumption().food;

    const upkeepHtml = `
        <h4 class="uk-heading-line uk-text-center"><span>Upkeep Phase</span></h4>
        <div class="uk-grid-small" uk-grid>
            <div class="uk-width-expand@s">
                <p class="uk-text-meta uk-margin-remove">Resource Dice: ${numDice}d${sizeData.die}</p>
                <p class="uk-text-meta uk-margin-remove">Resource Points (RP) for this turn: ${turnData.turnResourcePoints || 0}</p>
                <p class="uk-text-meta uk-margin-remove">Kingdom Consumption: ${consumption} Food</p>
            </div>
            <div class="uk-width-auto@s uk-text-right">
                <button class="uk-button uk-button-primary uk-margin-small-bottom" id="upkeep-roll-resources" ${turnData.rolledResources ? 'disabled' : ''}>1. Roll Resources</button>
                <button class="uk-button uk-button-primary uk-margin-small-bottom" id="upkeep-pay-consumption" ${turnData.paidConsumption ? 'disabled' : ''}>2. Pay Consumption</button>
                <button class="uk-button uk-button-primary" id="upkeep-apply-unrest" ${turnData.appliedUnrest ? 'disabled' : ''}>3. Apply Unrest Effects</button>
            </div>
        </div>
    `;

    // --- Activities Checklist UI ---
    let activitiesHtml = '';
    for (const category in KINGDOM_ACTIVITIES) {
        activitiesHtml += `<h4 class="uk-heading-line uk-text-center uk-margin-top"><span>${category.charAt(0).toUpperCase() + category.slice(1)} Activities</span></h4>`;
        activitiesHtml += '<div class="uk-grid-small uk-child-width-1-2@s" uk-grid>';
        KINGDOM_ACTIVITIES[category].forEach(activityName => {
            const key = `activity_${activityName.replace(/\s+/g, '_')}`;
            const isChecked = turnData[key] ? 'checked' : '';
            activitiesHtml += `
                <div>
                    <label><input class="uk-checkbox" type="checkbox" data-key="${key}" ${isChecked}> ${activityName}</label>
                </div>`;
        });
        activitiesHtml += '</div>';
    }
    
    // --- Event Phase UI ---
    const eventCheckDC = 16 - (kingdom.eventCheckModifier || 0);
    const eventPhaseHtml = `
        <h4 class="uk-heading-line uk-text-center"><span>Event Phase</span></h4>
        <div class="uk-grid-small" uk-grid>
            <div class="uk-width-expand@s">
                <p class="uk-text-meta uk-margin-remove">Current Event Check DC: ${eventCheckDC}</p>
                <p class="uk-text-meta uk-margin-remove">Current Event: ${turnData.currentEvent || 'None'}</p>
            </div>
            <div class="uk-width-auto@s uk-text-right">
                <button class="uk-button uk-button-primary" id="event-check-event" ${turnData.eventChecked ? 'disabled' : ''}>Check for Event</button>
            </div>
        </div>
    `;

    // --- NEW: End of Turn Section ---
    const endOfTurnHtml = `
        <h4 class="uk-heading-line uk-text-center"><span>End of Turn</span></h4>
        <div class="uk-grid-small" uk-grid>
            <div class="uk-width-1-2@s">
                <label class="uk-form-label">XP Gained this Turn</label>
                <input class="uk-input" type="number" data-key="turnXP" value="${turnData.turnXP || 0}" placeholder="XP from events, milestones...">
            </div>
            <div class="uk-width-1-2@s">
                <label class="uk-form-label">Event Name (if not random)</label>
                <input class="uk-input" type="text" data-key="currentEvent" value="${turnData.currentEvent || ''}" placeholder="Story event, etc.">
            </div>
            <div class="uk-width-1-1">
                <label class="uk-form-label">Turn Notes</label>
                <textarea class="uk-textarea" rows="3" data-key="currentNotes" placeholder="Any notes for this turn...">${turnData.currentNotes || ""}</textarea>
            </div>
        </div>
    `;


    container.innerHTML = `
        <div class="uk-flex uk-flex-between uk-flex-middle">
            <h3 class="uk-card-title">Turn Tracker (Fame: ${turnData.turnFame || kingdom.fame}, Unrest: ${turnData.turnUnrest || kingdom.unrest})</h3>
            <div>
                <button id="save-turn-btn" class="uk-button uk-button-primary">Save Turn</button>
                <button id="clear-turn-btn" class="uk-button uk-button-secondary">Clear Turn</button>
            </div>
        </div>
        <hr>
        ${upkeepHtml}
        <hr>
        ${activitiesHtml}
        <hr>
        ${eventPhaseHtml}
        <hr>
        ${endOfTurnHtml}
    `;
}

function renderHistory() {
  const container = document.getElementById("history-content");
  if (history.length === 0) {
    container.innerHTML = '<h3 class="uk-card-title">History</h3><p>No turns have been saved yet.</p>';
    return;
  }
  
  const historyRows = history.map((turn, i) => {
    const performedActivities = Object.keys(turn)
      .filter(key => key.startsWith("activity_") && turn[key])
      .map(key => key.substring(9).replace(/_/g, " "))
      .join(", ") || "None";
      
    return `<tr>
        <td>${history.length - i} (Lvl ${turn.kingdomLevel})</td>
        <td>${turn.currentEvent || "N/A"}</td>
        <td>${turn.foodConsumed || 0}</td>
        <td>${performedActivities}</td>
        <td>${turn.currentNotes || "..."}</td>
      </tr>`;
  }).join('');
  
  container.innerHTML = `<h3 class="uk-card-title">History</h3>
    <table class="uk-table uk-table-striped uk-table-hover uk-table-small">
      <thead><tr><th>Turn</th><th>Event</th><th>Food Consumed</th><th>Activities</th><th>Notes</th></tr></thead>
      <tbody>${historyRows}</tbody>
    </table>`;
}

function renderSettlements() {
    const container = document.getElementById("settlements-content");
    let html = `<div class="uk-flex uk-flex-between uk-flex-middle">
        <h3 class="uk-card-title">Settlements & Urban Grids</h3>
        <button id="add-settlement-btn" class="uk-button uk-button-primary">Add New Settlement</button>
    </div>`;

    if (kingdom.settlements.length === 0) {
        html += "<p>No settlements created yet.</p>";
    } else {
        html += '<ul uk-accordion="multiple: true">';
        kingdom.settlements.forEach((settlement) => {
            const gridLots = settlement.lots.map((lot, index) => {
                let classes = "grid-lot";
                let style = "";
                let content = "";
                if (lot.buildingId) {
                    const structure = availableStructures.find(s => s.name === lot.structureName);
                    style = `background-color: ${structure ? structureColors[structure.category] : "#ccc"}; color: #333;`;
                    if (lot.isOrigin) {
                        content = lot.structureName;
                        classes += " can-build";
                    } else {
                        classes += " occupied-child";
                    }
                } else {
                    classes += " can-build";
                }
                return `<button class="${classes}" style="${style}" data-settlement-id="${settlement.id}" data-lot-index="${index}">${content}</button>`;
            }).join("");

            html += `<li class="uk-open">
                <a class="uk-accordion-title" href="#">${settlement.name}
                    <button class="uk-button uk-button-danger uk-button-small uk-float-right" data-delete-settlement-id="${settlement.id}">Delete</button>
                </a>
                <div class="uk-accordion-content">
                    <div class="urban-grid cols-${settlement.gridSize}">${gridLots}</div>
                </div>
            </li>`;
        });
        html += "</ul>";
    }
    container.innerHTML = html;
}

function renderArmies() {
    const container = document.getElementById("armies-content");
    let html = `<div class="uk-flex uk-flex-between uk-flex-middle">
        <h3 class="uk-card-title">Armies</h3>
        <button id="add-army-btn" class="uk-button uk-button-primary">Add New Army</button>
    </div>`;

    if (!kingdom.armies || kingdom.armies.length === 0) {
        html += "<p>No armies have been recruited yet.</p>";
    } else {
        html += '<div uk-grid class="uk-child-width-1-2@m">';
        kingdom.armies.forEach(army => {
            html += `<div>
                <div class="uk-card uk-card-default uk-card-body army-card">
                    <div class="uk-card-badge uk-label">${army.location || "Undeployed"}</div>
                    <h4 class="uk-card-title">${army.name} (Lvl ${army.level})</h4>
                    <dl class="uk-description-list uk-description-list-divider">
                        <dt>HP</dt><dd>${army.hp}</dd><dt>AC</dt><dd>${army.ac}</dd>
                        <dt>Attack</dt><dd>+${army.attack}</dd><dt>Damage</dt><dd>${army.damage}</dd>
                        <dt>Consumption</dt><dd>${army.consumption}</dd>
                    </dl>
                    <p><strong>Notes:</strong> ${army.notes || "None"}</p>
                    <button class="uk-button uk-button-secondary uk-button-small" data-edit-army-id="${army.id}">Edit</button>
                    <button class="uk-button uk-button-danger uk-button-small" data-delete-army-id="${army.id}">Delete</button>
                </div>
            </div>`;
        });
        html += "</div>";
    }
    container.innerHTML = html;
}

function renderCreation() {
    // This function remains large due to its unique and complex form structure.
    // Abstracting it further would likely add more complexity than it removes.
    const container = document.getElementById("creation-content");

    const createOptions = (sourceObject, selectedKey) => {
        return Object.entries(sourceObject).map(([key, value]) =>
            `<option value="${key}" ${key === selectedKey ? "selected" : ""}>${value.name}</option>`
        ).join('');
    };

    let advancementHtml = "<ul uk-accordion>";
    for (let i = 2; i <= 20; i++) {
        const levelKey = `lvl${i}`;
        const levelData = kingdom.advancement[levelKey] || {};
        if (Object.keys(levelData).length > 0) {
            advancementHtml += `<li><a class="uk-accordion-title" href="#">Level ${i}</a><div class="uk-accordion-content">`;
            if (levelData.hasOwnProperty("feat")) {
                advancementHtml += `<div class="uk-margin-small"><label class="uk-form-label">Feat</label><input class="uk-input uk-form-small" type="text" data-adv-level="${levelKey}" data-adv-key="feat" value="${levelData.feat || ""}"></div>`;
                advancementHtml += `<div class="uk-margin-small"><label class="uk-form-label">Feat Option</label><input class="uk-input uk-form-small" type="text" data-adv-level="${levelKey}" data-adv-key="featOption" value="${levelData.featOption || ""}"></div>`;
            }
            if (levelData.hasOwnProperty("skillIncrease")) advancementHtml += `<div class="uk-margin-small"><label class="uk-form-label">Skill Increase</label><input class="uk-input uk-form-small" type="text" data-adv-level="${levelKey}" data-adv-key="skillIncrease" value="${levelData.skillIncrease || ""}"></div>`;
            if (levelData.hasOwnProperty("abilityBoosts")) advancementHtml += `<div class="uk-margin-small"><label class="uk-form-label">Ability Boosts</label><input class="uk-input uk-form-small" type="text" data-adv-level="${levelKey}" data-adv-key="abilityBoosts" value="${levelData.abilityBoosts || ""}"></div>`;
            if (levelData.hasOwnProperty("ruinResistance")) advancementHtml += `<div class="uk-margin-small"><label class="uk-form-label">Ruin Resistance</label><input class="uk-input uk-form-small" type="text" data-adv-level="${levelKey}" data-adv-key="ruinResistance" value="${levelData.ruinResistance || ""}"></div>`;
            advancementHtml += `</div></li>`;
        }
    }
    advancementHtml += "</ul>";

    container.innerHTML = `
        <div class="uk-grid-divider" uk-grid>
            <div class="uk-width-1-2@m">
                <h3 class="uk-card-title">Kingdom Creation</h3>
                <p>Make your selections below. Your kingdom's starting ability scores will be calculated automatically.</p>
                <form class="uk-form-stacked" id="creation-form">
                    <div class="uk-margin"><label class="uk-form-label" for="kingdom-name-input">Kingdom Name</label><input class="uk-input" id="kingdom-name-input" type="text" data-key="name" value="${kingdom.name || ""}"></div>
                    <div class="uk-margin"><label class="uk-form-label" for="kingdom-capital-input">Capital Name</label><input class="uk-input" id="kingdom-capital-input" type="text" data-key="capital" value="${kingdom.capital || ""}"></div><hr>
                    <div class="uk-margin"><label class="uk-form-label">1. Select Charter</label><div class="uk-grid-small" uk-grid><div class="uk-width-expand"><select class="uk-select" data-creation-key="charter">${createOptions(KINGDOM_CHARTERS, kingdom.charter)}</select></div><div class="uk-width-1-3"><select class="uk-select" id="kingdom-charter-boost-select" data-creation-key="charterBoost"></select></div></div></div>
                    <div class="uk-margin"><label class="uk-form-label">2. Select Heartland</label><select class="uk-select" data-creation-key="heartland">${createOptions(KINGDOM_HEARTLANDS, kingdom.heartland)}</select></div>
                    <div class="uk-margin"><label class="uk-form-label">3. Select Government</label><div class="uk-grid-small" uk-grid><div class="uk-width-expand"><select class="uk-select" data-creation-key="government">${createOptions(KINGDOM_GOVERNMENTS, kingdom.government)}</select></div><div class="uk-width-1-3"><select class="uk-select" id="kingdom-government-boost-select" data-creation-key="governmentBoost"></select></div></div></div>
                    <div class="uk-margin"><label class="uk-form-label">4. Final Free Ability Boosts</label><div class="uk-grid-small" uk-grid><div class="uk-width-1-2"><select class="uk-select" id="kingdom-free-boost-1" data-creation-key="freeBoost1"></select></div><div class="uk-width-1-2"><select class="uk-select" id="kingdom-free-boost-2" data-creation-key="freeBoost2"></select></div></div></div>
                    <div class="uk-margin"><label class="uk-form-label">5. Initial Skill Investments</label><p class="uk-text-small">Select four different skills to become Trained in.</p><div class="uk-grid-small" uk-grid><div class="uk-width-1-2@s"><select class="uk-select" id="skill-invest-1" data-creation-key="skillInvest1"></select></div><div class="uk-width-1-2@s"><select class="uk-select" id="skill-invest-2" data-creation-key="skillInvest2"></select></div><div class="uk-width-1-2@s"><select class="uk-select" id="skill-invest-3" data-creation-key="skillInvest3"></select></div><div class="uk-width-1-2@s"><select class="uk-select" id="skill-invest-4" data-creation-key="skillInvest4"></select></div></div></div><hr>
                    <h4 class="uk-heading-line"><span>Resulting Base Scores</span></h4>
                    <div id="ability-score-results" class="uk-child-width-1-4" uk-grid>
                        <div><dl class="uk-description-list"><dt>Culture</dt><dd id="result-culture">10</dd></dl></div>
                        <div><dl class="uk-description-list"><dt>Economy</dt><dd id="result-economy">10</dd></dl></div>
                        <div><dl class="uk-description-list"><dt>Loyalty</dt><dd id="result-loyalty">10</dd></dl></div>
                        <div><dl class="uk-description-list"><dt>Stability</dt><dd id="result-stability">10</dd></dl></div>
                    </div>
                    <button type="button" id="save-creation-btn" class="uk-button uk-button-primary uk-margin-top">Save Creation Choices</button>
                </form>
            </div>
            <div class="uk-width-1-2@m"><h3 class="uk-card-title">Advancement</h3><p>Track kingdom advancement here.</p><div id="advancement-content-area" class="uk-height-large uk-overflow-auto">${advancementHtml}</div></div>
        </div>`;
}

function renderSaveManagement() {
  document.getElementById("save-management-content").innerHTML = `
    <h3 class="uk-card-title">Save Management</h3>
    <p>Use export to create a backup file and import to load from one.</p>
    <div class="uk-button-group">
        <button id="import-btn" class="uk-button uk-button-primary">Import</button>
        <button id="export-btn" class="uk-button uk-button-secondary">Export</button>
        <button id="recover-btn" class="uk-button uk-button-default">Recover from Backup</button>
    </div><hr>
    <h3 class="uk-card-title">Reset Kingdom</h3>
    <p>This will permanently erase your kingdom and start a new one.</p>
    <button id="reset-kingdom-btn" class="uk-button uk-button-danger">Reset Kingdom</button>`;
}

// ==========================================
// MODAL & UI HELPERS
// ==========================================

function showConfirmationModal(message, onConfirm) {
    UIkit.modal.confirm(message).then(() => {
        if (onConfirm) onConfirm();
    }, () => {});
}

function showFormModal(title, formHtml, onSave) {
    const modalContent = `
        <div class="uk-modal-header"><h2 class="uk-modal-title">${title}</h2></div>
        <div class="uk-modal-body">${formHtml}</div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close">Cancel</button>
            <button class="uk-button uk-button-primary" id="modal-save-btn">Save</button>
        </div>`;

    const modal = UIkit.modal.dialog(modalContent);
    const saveButton = modal.$el.querySelector("#modal-save-btn");
    
    saveButton.addEventListener("click", () => {
        if (onSave(modal.$el)) {
            modal.hide();
        }
    });
}

function showLevelUpModal(newLevel) {
    const advancement = kingdom.advancement[`lvl${newLevel}`];
    if (!advancement) {
        UIkit.modal.alert("No advancement data found for this level.");
        return;
    }

    let benefitsHtml = '<ul>';
    if (advancement.hasOwnProperty('feat')) benefitsHtml += '<li>A new Kingdom Feat</li>';
    if (advancement.hasOwnProperty('skillIncrease')) benefitsHtml += '<li>A Kingdom Skill Increase</li>';
    if (advancement.hasOwnProperty('abilityBoosts')) benefitsHtml += '<li>Kingdom Ability Boosts</li>';
    if (advancement.hasOwnProperty('ruinResistance')) benefitsHtml += '<li>Increased Ruin Resistance</li>';
    benefitsHtml += '</ul>';

    // Check if choices have already been made for this level
    const skillIncreaseDone = advancement.skillIncrease !== '';
    const featDone = advancement.feat !== '';

    let choicesHtml = '';
    if (advancement.hasOwnProperty('skillIncrease')) {
        choicesHtml += `<button class="uk-button uk-button-secondary uk-margin-small-right" id="level-up-skill-btn" ${skillIncreaseDone ? 'disabled' : ''}>Choose Skill Increase</button>`;
    }
    // --- NEW: Add the "Choose Feat" button ---
    if (advancement.hasOwnProperty('feat')) {
        choicesHtml += `<button class="uk-button uk-button-secondary" id="level-up-feat-btn" ${featDone ? 'disabled' : ''}>Choose Feat</button>`;
    }

    const modalContent = `
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Your kingdom has reached Level ${newLevel}!</h2>
        </div>
        <div class="uk-modal-body">
            <p>You gain the following benefits:</p>
            ${benefitsHtml}
            <p>Please make your selections below. Choices are permanent.</p>
            ${choicesHtml}
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-primary" id="level-up-finish-btn">Finish Level Up</button>
        </div>`;

    const modal = UIkit.modal.dialog(modalContent);

    // --- NEW: Add event listener for the feat button ---
    const featButton = modal.$el.querySelector('#level-up-feat-btn');
    if (featButton) {
        featButton.addEventListener('click', () => {
            showFeatSelectionModal(newLevel);
            modal.hide();
        });
    }

    const skillButton = modal.$el.querySelector('#level-up-skill-btn');
    if (skillButton) {
        skillButton.addEventListener('click', () => {
            showSkillIncreaseModal(newLevel);
            modal.hide();
        });
    }

    modal.$el.querySelector('#level-up-finish-btn').addEventListener('click', () => {
        kingdom.level = newLevel;
        kingdom.xp -= 1000;
        saveState();
        renderAll();
        modal.hide();
        UIkit.notification({ message: `Kingdom advancement to Level ${newLevel} complete!`, status: 'success' });
    });
}

function showSkillIncreaseModal(level) {
    let skillOptionsHtml = '<ul class="uk-list uk-list-divider">';
    const currentSkillRanks = calculateSkillModifiers(); // We can reuse this!

    for (const skillName in kingdom.skills) {
        const currentRank = kingdom.skills[skillName].prof;
        if (currentRank < PROFICIENCY_RANKS.length - 1) { // If not Legendary
            const nextRankName = PROFICIENCY_RANKS[currentRank + 1];
            skillOptionsHtml += `
                <li>
                    <div class="uk-grid-small" uk-grid>
                        <div class="uk-width-expand">${skillName} (${PROFICIENCY_RANKS[currentRank]})</div>
                        <div class="uk-width-auto">
                            <button class="uk-button uk-button-primary uk-button-small" data-skill-name="${skillName}">Increase to ${nextRankName}</button>
                        </div>
                    </div>
                </li>`;
        }
    }
    skillOptionsHtml += '</ul>';

    const modal = UIkit.modal.dialog(`
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Choose Skill Increase for Level ${level}</h2>
        </div>
        <div class="uk-modal-body">${skillOptionsHtml}</div>
    `);

    modal.$el.addEventListener('click', (e) => {
        if (e.target.matches('button[data-skill-name]')) {
            const skillName = e.target.dataset.skillName;
            
            // This is the key part: we save the *name* of the skill that was increased.
            // Our calculateSkillModifiers function will see this and apply the increase.
            kingdom.advancement[`lvl${level}`].skillIncrease = skillName;
            
            saveState();
            modal.hide();
            showLevelUpModal(level); // Re-open the main level up modal to show the choice was made
        }
    });
}

function showFeatSelectionModal(level) {
    let featOptionsHtml = '<ul class="uk-list uk-list-divider">';
    
    // Filter the master feat list to find eligible feats
    const eligibleFeats = KINGDOM_FEATS.filter(feat => 
        feat.level <= level && checkFeatPrerequisites(feat)
    );

    if (eligibleFeats.length === 0) {
        featOptionsHtml += '<li>Your kingdom does not currently meet the prerequisites for any available feats.</li>';
    } else {
        eligibleFeats.forEach(feat => {
            featOptionsHtml += `
                <li>
                    <div class="uk-grid-small" uk-grid>
                        <div class="uk-width-expand">
                            <a class="uk-text-bold" uk-tooltip="title: ${feat.description}; pos: top-left">${feat.name}</a>
                            <p class="uk-text-meta uk-margin-remove">Lvl ${feat.level} ${feat.prereq ? `(Prereq: ${feat.prereq.skill || feat.prereq.ability || 'Multiple Skills Trained'})` : ''}</p>
                        </div>
                        <div class="uk-width-auto">
                            <button class="uk-button uk-button-primary uk-button-small" data-feat-name="${feat.name}">Select</button>
                        </div>
                    </div>
                </li>`;
        });
    }
    featOptionsHtml += '</ul>';

    const modal = UIkit.modal.dialog(`
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Choose Feat for Level ${level}</h2>
        </div>
        <div class="uk-modal-body">${featOptionsHtml}</div>
    `);

    modal.$el.addEventListener('click', (e) => {
        if (e.target.matches('button[data-feat-name]')) {
            const featName = e.target.dataset.featName;
            
            // Save the chosen feat name to the advancement object
            kingdom.advancement[`lvl${level}`].feat = featName;
            
            saveState();
            modal.hide();
            showLevelUpModal(level); // Re-open the main level up modal
        }
    });
}

function showEditLeaderModal(role) {
    const leader = kingdom.leaders[role];
    const formHtml = `
        <form>
            <div class="uk-margin"><label class="uk-form-label">Name</label><input class="uk-input" id="leader-name" type="text" value="${leader.name || ""}"></div>
            <div class="uk-margin"><label class="uk-form-label">Status</label><div class="uk-form-controls uk-grid-small uk-child-width-auto uk-grid">
                <label><input class="uk-radio" type="radio" name="leader-status" value="PC" ${leader.status === "PC" ? "checked" : ""}> PC</label>
                <label><input class="uk-radio" type="radio" name="leader-status" value="NPC" ${leader.status === "NPC" ? "checked" : ""}> NPC</label>
                <label><input class="uk-radio" type="radio" name="leader-status" value="Hired" ${leader.status === "Hired" ? "checked" : ""}> Hired</label>
                <label><input class="uk-radio" type="radio" name="leader-status" value="Vacant" ${leader.status === "Vacant" ? "checked" : ""}> Vacant</label>
            </div></div>
            <div class="uk-margin"><label><input class="uk-checkbox" id="leader-is-invested" type="checkbox" ${leader.isInvested ? "checked" : ""}> Is Invested</label></div>
        </form>`;
        
    showFormModal(`Edit ${role}`, formHtml, (modalEl) => {
        const nameInput = modalEl.querySelector("#leader-name");
        handleValidatedInput(nameInput, (val) => Validators.isLength(val, 50), (value) => {
            kingdom.leaders[role].name = value;
            kingdom.leaders[role].status = modalEl.querySelector('input[name="leader-status"]:checked').value;
            kingdom.leaders[role].isInvested = modalEl.querySelector("#leader-is-invested").checked;
            saveState();
            renderSpecific(["kingdom"]);
            A11yHelpers.announceStateChange(`${role} updated`);
        });
        return true; // Assume success for hiding modal, validation provides feedback
    });
}

function addSettlement() {
    UIkit.modal.prompt("New Settlement Name:", "New Settlement").then(name => {
        if (!name) return;
        handleValidatedInput({ value: name }, (val) => Validators.isNotEmpty(val) && Validators.isLength(val, 50), (validName) => {
            const newSettlement = {
                id: Date.now(), name: validName, gridSize: 6,
                lots: Array(36).fill(null).map(() => ({ buildingId: null, isOrigin: false, structureName: null }))
            };
            kingdom.settlements.push(newSettlement);
            saveState();
            renderSpecific(["settlements"]);
            A11yHelpers.announceStateChange(`Settlement ${validName} added`);
        });
    });
}

function deleteSettlement(settlementId) {
    showConfirmationModal("Are you sure you want to delete this settlement?", () => {
        const settlementName = kingdom.settlements.find(s => s.id == settlementId)?.name || "Settlement";
        kingdom.settlements = kingdom.settlements.filter(s => s.id != settlementId);
        saveState();
        renderSpecific(["settlements", "kingdom"]);
        UIkit.notification({ message: "Settlement deleted.", status: "danger" });
        A11yHelpers.announceStateChange(`${settlementName} deleted`);
    });
}

function canPlaceStructure(settlement, startX, startY, width, height) {
  if (startX + width > settlement.gridSize || startY + height > settlement.gridSize) return false;
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      if (settlement.lots[y * settlement.gridSize + x].buildingId) return false;
    }
  }
  return true;
}

function placeStructure(settlementId, lotIndex, structureName) {
  const settlement = kingdom.settlements.find(s => s.id == settlementId);
  const structure = availableStructures.find(s => s.name === structureName);
  if (!structure || !settlement) return;

  const oldBuildingId = settlement.lots[lotIndex].buildingId;
  if (oldBuildingId) {
    settlement.lots.forEach(lot => {
      if (lot.buildingId === oldBuildingId) {
        Object.assign(lot, { buildingId: null, isOrigin: false, structureName: null });
      }
    });
  }

  if (structureName !== "Clear Lot") {
    const [width, height] = structure.lots;
    const startX = lotIndex % settlement.gridSize;
    const startY = Math.floor(lotIndex / settlement.gridSize);
    if (!canPlaceStructure(settlement, startX, startY, width, height)) {
      UIkit.modal.alert("Not enough space to build here.");
      return;
    }
    const buildingId = Date.now();
    for (let y = startY; y < startY + height; y++) {
      for (let x = startX; x < startX + width; x++) {
        settlement.lots[y * settlement.gridSize + x] = { buildingId, isOrigin: x === startX && y === startY, structureName };
      }
    }
  }

  saveState();
  renderSpecific(["settlements", "kingdom"]);
  A11yHelpers.announceStateChange(`${structureName} ${structureName === "Clear Lot" ? "removed" : "built"}`);
}

function showEditLotModal(settlementId, lotIndex) {
  const settlement = kingdom.settlements.find(s => s.id == settlementId);
  if (!settlement) return;
  const lot = settlement.lots[lotIndex];

  if (lot.buildingId && !lot.isOrigin) {
    UIkit.notification({ message: "Click top-left corner of a building to modify.", status: "warning" });
    return;
  }

  const startX = lotIndex % settlement.gridSize;
  const startY = Math.floor(lotIndex / settlement.gridSize);

  let html = '<div class="uk-modal-body uk-height-medium uk-overflow-auto"><h4>Select Structure</h4><ul class="uk-list uk-list-striped">';
  availableStructures.forEach(struct => {
    const [width, height] = struct.lots;
    const canBuild = canPlaceStructure(settlement, startX, startY, width, height);
    if ((struct.name === "Clear Lot" && lot.buildingId) || (struct.name !== "Clear Lot" && canBuild)) {
      html += `<li><a href="#" class="select-structure" data-s-name="${struct.name}">${struct.name} (${struct.category})</a></li>`;
    }
  });
  html += "</ul></div>";

  const modal = UIkit.modal.dialog(html);
  modal.$el.addEventListener("click", (e) => {
    if (e.target.matches(".select-structure")) {
      e.preventDefault();
      placeStructure(settlementId, lotIndex, e.target.dataset.sName);
      modal.hide();
    }
  });
}

function showArmyModal(armyId = null) {
  const isEditing = armyId !== null;
  const army = isEditing ? kingdom.armies.find(a => a.id === armyId) : {
      id: Date.now(), name: "", level: 1, hp: 10, ac: 16, attack: 5,
      damage: "1d6", consumption: 1, location: "", notes: ""
  };
  
  const formHtml = `
      <form class="uk-form-stacked" uk-grid>
          <div class="uk-width-1-2@s"><label class="uk-form-label">Name</label><input class="uk-input" id="army-name" type="text" value="${army.name}"></div>
          <div class="uk-width-1-2@s"><label class="uk-form-label">Location</label><input class="uk-input" id="army-location" type="text" value="${army.location}"></div>
          <div class="uk-width-1-4@s"><label class="uk-form-label">Level</label><input class="uk-input" id="army-level" type="number" value="${army.level}"></div>
          <div class="uk-width-1-4@s"><label class="uk-form-label">HP</label><input class="uk-input" id="army-hp" type="number" value="${army.hp}"></div>
          <div class="uk-width-1-4@s"><label class="uk-form-label">AC</label><input class="uk-input" id="army-ac" type="number" value="${army.ac}"></div>
          <div class="uk-width-1-4@s"><label class="uk-form-label">Attack Bonus</label><input class="uk-input" id="army-attack" type="number" value="${army.attack}"></div>
          <div class="uk-width-1-2@s"><label class="uk-form-label">Damage</label><input class="uk-input" id="army-damage" type="text" value="${army.damage}"></div>
          <div class="uk-width-1-2@s"><label class="uk-form-label">Consumption</label><input class="uk-input" id="army-consumption" type="number" value="${army.consumption}"></div>
          <div class="uk-width-1-1"><label class="uk-form-label">Notes / Gear</label><textarea class="uk-textarea" id="army-notes" rows="3">${army.notes}</textarea></div>
      </form>`;
      
  showFormModal(isEditing ? "Edit Army" : "Add New Army", formHtml, (modalEl) => {
    const nameInput = modalEl.querySelector("#army-name");
    const levelInput = modalEl.querySelector("#army-level");
    let isValid = true;
    
    try {
        Validators.isNotEmpty(nameInput.value);
        Validators.validateLevel(parseInt(levelInput.value));
    } catch (error) {
        UIkit.notification({ message: error.message, status: "danger" });
        isValid = false;
    }
    
    if (isValid) {
        const updatedArmy = {
            id: army.id,
            name: nameInput.value,
            location: modalEl.querySelector("#army-location").value,
            level: parseInt(levelInput.value) || 1,
            hp: parseInt(modalEl.querySelector("#army-hp").value) || 0,
            ac: parseInt(modalEl.querySelector("#army-ac").value) || 10,
            attack: parseInt(modalEl.querySelector("#army-attack").value) || 0,
            damage: modalEl.querySelector("#army-damage").value,
            consumption: parseInt(modalEl.querySelector("#army-consumption").value) || 0,
            notes: modalEl.querySelector("#army-notes").value,
        };
        if (isEditing) {
            const index = kingdom.armies.findIndex(a => a.id === armyId);
            kingdom.armies[index] = updatedArmy;
        } else {
            kingdom.armies.push(updatedArmy);
        }
        saveState();
        renderSpecific(["armies"]);
        A11yHelpers.announceStateChange(`Army ${updatedArmy.name} ${isEditing ? "updated" : "added"}`);
        return true;
    }
    return false;
  });
}

function deleteArmy(armyId) {
    showConfirmationModal("Are you sure you want to disband this army?", () => {
        const armyName = kingdom.armies.find(a => a.id === armyId)?.name || "Army";
        kingdom.armies = kingdom.armies.filter(a => a.id !== armyId);
        saveState();
        renderSpecific(["armies"]);
        UIkit.notification({ message: "Army disbanded.", status: "danger" });
        A11yHelpers.announceStateChange(`${armyName} disbanded`);
    });
}

// ==========================================
// KINGDOM CREATION LOGIC
// ==========================================

function calculateAndRenderCreationScores() {
  const form = document.getElementById("creation-form");
  if (!form) return;

  const getVal = (sel) => form.querySelector(sel)?.value;
  const selections = {
    charter: getVal('[data-creation-key="charter"]'),
    charterBoost: getVal('[data-creation-key="charterBoost"]'),
    heartland: getVal('[data-creation-key="heartland"]'),
    government: getVal('[data-creation-key="government"]'),
    governmentBoost: getVal('[data-creation-key="governmentBoost"]'),
    freeBoost1: getVal('[data-creation-key="freeBoost1"]'),
    freeBoost2: getVal('[data-creation-key="freeBoost2"]'),
  };

  const scores = { culture: 10, economy: 10, loyalty: 10, stability: 10 };
  const boosts = [];
  const flaws = [];

  const charter = KINGDOM_CHARTERS[selections.charter];
  if (charter) {
    if (charter.flaw) flaws.push(charter.flaw);
    charter.boosts.forEach(b => b === "free" ? boosts.push(selections.charterBoost) : boosts.push(b));
  }
  
  const heartland = KINGDOM_HEARTLANDS[selections.heartland];
  if (heartland) boosts.push(heartland.boost);
  
  const gov = KINGDOM_GOVERNMENTS[selections.government];
  if (gov) {
    gov.boosts.forEach(b => b === "free" ? boosts.push(selections.governmentBoost) : boosts.push(b));
  }
  
  boosts.push(selections.freeBoost1, selections.freeBoost2);
  
  boosts.filter(b => b).forEach(b => scores[b] = (scores[b] || 10) + 2);
  flaws.forEach(f => scores[f] = (scores[f] || 10) - 2);

  Object.entries(scores).forEach(([stat, score]) => {
      document.getElementById(`result-${stat}`).textContent = score;
  });

  updateFreeBoostDropdowns(selections);
  updateSkillInvestmentDropdowns();
}

function updateFreeBoostDropdowns(selections) {
  const abilityOptions = ["culture", "economy", "loyalty", "stability"];
  const createAbilityBoostOptions = (selectedValue, disabledOptions = []) => {
    let options = '<option value="">-- Select --</option>';
    abilityOptions.forEach(opt => {
      if (!disabledOptions.includes(opt)) {
        options += `<option value="${opt}" ${opt === selectedValue ? "selected" : ""}>${opt.charAt(0).toUpperCase() + opt.slice(1)}</option>`;
      }
    });
    return options;
  };

  const charter = KINGDOM_CHARTERS[selections.charter];
  const charterBoostSelect = document.getElementById("kingdom-charter-boost-select");
  if (charter?.boosts.includes("free")) {
    charterBoostSelect.innerHTML = createAbilityBoostOptions(selections.charterBoost, [charter.flaw, ...charter.boosts.filter(b => b !== "free")]);
    charterBoostSelect.disabled = false;
  } else {
    charterBoostSelect.innerHTML = "";
    charterBoostSelect.disabled = true;
  }
  
  const gov = KINGDOM_GOVERNMENTS[selections.government];
  const govBoostSelect = document.getElementById("kingdom-government-boost-select");
  if (gov?.boosts.includes("free")) {
    govBoostSelect.innerHTML = createAbilityBoostOptions(selections.governmentBoost, gov.boosts.filter(b => b !== "free"));
    govBoostSelect.disabled = false;
  } else {
    govBoostSelect.innerHTML = "";
    govBoostSelect.disabled = true;
  }
  
  document.getElementById("kingdom-free-boost-1").innerHTML = createAbilityBoostOptions(selections.freeBoost1, [selections.freeBoost2]);
  document.getElementById("kingdom-free-boost-2").innerHTML = createAbilityBoostOptions(selections.freeBoost2, [selections.freeBoost1]);
}

function updateSkillInvestmentDropdowns() {
    const govSkills = KINGDOM_GOVERNMENTS[document.querySelector('[data-creation-key="government"]').value]?.skills || [];
    const selections = Array.from({ length: 4 }, (_, i) => document.getElementById(`skill-invest-${i + 1}`).value);

    for (let i = 0; i < 4; i++) {
        const currentSelect = document.getElementById(`skill-invest-${i + 1}`);
        const currentValue = selections[i];
        const disabledOptions = [...govSkills, ...selections.filter((s, idx) => i !== idx && s)];

        let optionsHTML = '<option value="">-- Select Skill --</option>';
        Object.keys(KINGDOM_SKILLS).forEach(skillName => {
            if (skillName === currentValue) {
                optionsHTML += `<option value="${skillName}" selected>${skillName}</option>`;
            } else if (!disabledOptions.includes(skillName)) {
                optionsHTML += `<option value="${skillName}">${skillName}</option>`;
            }
        });
        currentSelect.innerHTML = optionsHTML;
    }
}

// ==========================================
// TURN MANAGEMENT
// ==========================================

function clearTurn() {
    turnData = {
        turnFame: kingdom.fame + 1,
        turnUnrest: kingdom.unrest,
        turnResourcePoints: 0,
        turnXP: 0,
        currentNotes: "",
        currentEvent: "",
        rolledResources: false,
        paidConsumption: false,
        eventChecked: false // <-- Add this line
    };
    for (const category in KINGDOM_ACTIVITIES) {
        KINGDOM_ACTIVITIES[category].forEach(activityName => {
            const key = `activity_${activityName.replace(/\s+/g, '_')}`;
            turnData[key] = false;
        });
    }
    renderTurnTracker();
}

function saveTurn() {
    showConfirmationModal("Are you sure you want to end the turn and save?", () => {
        safeOperation(() => {
            const consumption = calculateConsumption();
            kingdom.food = Math.max(0, kingdom.food - consumption.food);
            
            // This is the key change: cap XP at 1000.
            kingdom.xp = Math.min(1000, kingdom.xp + (turnData.turnXP || 0));

            kingdom.unrest = turnData.turnUnrest || 0;
            kingdom.fame = turnData.turnFame || 0;
            kingdom.treasury += turnData.turnResourcePoints || 0;

            updateRuin("corruption", turnData.turnCorruption || 0);
            updateRuin("crime", turnData.turnCrime || 0);
            updateRuin("decay", turnData.turnDecay || 0);
            updateRuin("strife", turnData.turnStrife || 0);

            const historyEntry = { ...turnData, kingdomLevel: kingdom.level, foodConsumed: consumption.food };
            history.unshift(historyEntry);
            if (history.length > 50) history.pop();

            saveState();
            clearTurn();
            renderAll();
            UIkit.notification({ message: "Turn saved successfully.", status: "success" });
            A11yHelpers.announceStateChange("Turn saved successfully");
        }, "Error saving turn");
    });
}

function handleResourceRoll() {
    const sizeData = KINGDOM_SIZE_TABLE.find(row => kingdom.size >= row.min && kingdom.size <= row.max) || KINGDOM_SIZE_TABLE[0];
    const dieType = sizeData.die;
    const numDice = kingdom.level + 4 + (turnData.turnBonusResourceDice || 0) - (turnData.turnPenaltyResourceDice || 0);

    let totalRP = 0;
    for (let i = 0; i < numDice; i++) {
        totalRP += Math.floor(Math.random() * dieType) + 1;
    }

    turnData.turnResourcePoints = totalRP;
    turnData.rolledResources = true; // Mark as rolled for this turn

    renderTurnTracker(); // Re-render to show the new RP total and disable the button
    A11yHelpers.announceStateChange(`Rolled ${totalRP} Resource Points`);
    UIkit.notification({
        message: `You generated ${totalRP} RP for this turn!`,
        status: 'success'
    });
}

function handlePayConsumption() {
    const consumption = calculateConsumption().food;
    if (turnData.paidConsumption) return;

    if (kingdom.food >= consumption) {
        // Happy path: We have enough food.
        kingdom.food -= consumption;
        turnData.paidConsumption = true;
        renderAll();
        UIkit.notification({ message: `Paid ${consumption} Food for consumption.`, status: 'success' });
        A11yHelpers.announceStateChange(`Paid ${consumption} Food.`);
    } else {
        // Complicated path: Not enough food. Give the user a choice.
        const foodShortage = consumption - kingdom.food;
        const rpCost = foodShortage * 5;

        UIkit.modal.confirm(`You are short ${foodShortage} Food. Pay with ${rpCost} RP instead? (If you decline, Unrest will increase).`).then(
            () => { // User clicked OK to pay with RP
                if (turnData.turnResourcePoints >= rpCost) {
                    kingdom.food = 0;
                    turnData.turnResourcePoints -= rpCost;
                    turnData.paidConsumption = true;
                    renderAll();
                    UIkit.notification({ message: `Paid for the shortfall with ${rpCost} RP.`, status: 'primary' });
                    A11yHelpers.announceStateChange(`Paid with ${rpCost} RP.`);
                } else {
                    UIkit.modal.alert(`You do not have enough RP. You must suffer the Unrest penalty.`);
                    const unrestGain = Math.floor(Math.random() * 4) + 1;
                    turnData.turnUnrest += unrestGain;
                    turnData.paidConsumption = true;
                    renderAll();
                    A11yHelpers.announceStateChange(`Gained ${unrestGain} Unrest.`);
                }
            },
            () => { // User clicked Cancel
                const unrestGain = Math.floor(Math.random() * 4) + 1;
                turnData.turnUnrest += unrestGain;
                turnData.paidConsumption = true;
                renderAll();
                UIkit.notification({ message: `Declined to pay with RP. Gained ${unrestGain} Unrest.`, status: 'warning' });
                A11yHelpers.announceStateChange(`Gained ${unrestGain} Unrest.`);
            }
        );
    }
}

function handleApplyUpkeepEffects() {
    // Step 1: Check for Unrest increases from sources like Overcrowding
    let overcrowdingUnrest = 0;
    kingdom.settlements.forEach(settlement => {
        if (isSettlementOvercrowded(settlement)) {
            overcrowdingUnrest++;
        }
    });
    if (overcrowdingUnrest > 0) {
        turnData.turnUnrest += overcrowdingUnrest;
        UIkit.notification({ message: `Gained ${overcrowdingUnrest} Unrest from overcrowded settlements.`, status: 'warning' });
    }

    // Step 2: Check if Unrest is high enough to cause further problems
    if (turnData.turnUnrest >= 10) {
        const ruinPoints = Math.floor(Math.random() * 10) + 1; // 1d10
        UIkit.modal.alert(`Your Unrest is ${turnData.turnUnrest}! You gain ${ruinPoints} Ruin points to distribute among your ruins.`).then(() => {
            // In a more advanced version, we would show a modal to distribute these points.
            // For now, we'll add them all to Corruption as a default.
            updateRuin('corruption', ruinPoints);
            UIkit.notification({ message: `${ruinPoints} Ruin points added to Corruption.`, status: 'danger' });
            
            // Step 3: Check for losing a hex
            const flatCheck = Math.floor(Math.random() * 20) + 1;
            if (flatCheck < 11) {
                UIkit.modal.alert(`You rolled a ${flatCheck} on a DC 11 flat check due to high Unrest. Your kingdom loses a hex! You must manually reduce your kingdom's Size.`);
                kingdom.size = Math.max(0, kingdom.size - 1);
            } else {
                 UIkit.modal.alert(`You rolled a ${flatCheck} on a DC 11 flat check due to high Unrest. You successfully avoided losing a hex.`);
            }
        });
    }
    
    // Step 4: Check for Anarchy
    if (turnData.turnUnrest >= 20) {
        UIkit.notification({ message: `Your kingdom has fallen into Anarchy! The results of all kingdom checks are worsened one degree.`, status: 'danger', timeout: 6000 });
    }

    turnData.appliedUnrest = true;
    renderAll();
}

function handleEventCheck() {
    const eventCheckDC = 16 - (kingdom.eventCheckModifier || 0);
    const d20Roll = Math.floor(Math.random() * 20) + 1;

    if (d20Roll < eventCheckDC) {
        // No event occurs
        kingdom.eventCheckModifier += 5; // DC gets easier next turn
        UIkit.notification({ message: `No event this turn (Rolled ${d20Roll} vs DC ${eventCheckDC}).` });
    } else {
        // Event occurs!
        kingdom.eventCheckModifier = 0; // DC resets for next turn
        const d100Roll = Math.floor(Math.random() * 100) + 1;
        const event = RANDOM_KINGDOM_EVENTS.find(e => d100Roll >= e.min && d100Roll <= e.max);
        
        if (event) {
            turnData.currentEvent = event.name;
            UIkit.modal.alert(`<h4>Event! (d100 = ${d100Roll})</h4><p>Your kingdom experiences the following event: <strong>${event.name}</strong></p>`);
        }
    }
    
    turnData.eventChecked = true;
    saveState();
    renderTurnTracker();
}

// ==========================================
// EVENT HANDLERS & LISTENERS
// ==========================================

function handleResourceUpdate(resource, action) {
    if (action === "increase") kingdom[resource]++;
    else if (action === "decrease") kingdom[resource] = Math.max(0, kingdom[resource] - 1);
    saveState();
    renderSpecific(["kingdom"]);
}

function handleLevelUp() {
    if (kingdom.xp < 1000) {
        UIkit.notification({ message: "Not enough XP to level up.", status: 'warning' });
        return;
    }
    // Open the new Level Up modal instead of doing the math here
    showLevelUpModal(kingdom.level + 1);
}

function handleKingdomInputChange(e) {
    const key = e.target.dataset.key;
    if (!key || !(key in kingdom)) return;
    
    try {
        const value = e.target.type === "number" ? parseInt(e.target.value, 10) || 0 : e.target.value;
        if (key === "level") Validators.validateLevel(value);
        if (key === "name") Validators.validateKingdomName(value);
        kingdom[key] = value;
        saveState();
    } catch (error) {
        UIkit.notification({ message: error.message, status: 'danger' });
        e.target.classList.add('uk-form-danger');
        setTimeout(() => e.target.classList.remove('uk-form-danger'), 3000);
    }
}

function handleTurnDataUpdate(e) {
    const { key } = e.target.dataset;
    if (!key) return;
    if (e.target.type === "checkbox") turnData[key] = e.target.checked;
    else if (e.target.type === "number") turnData[key] = parseInt(e.target.value, 10) || 0;
    else turnData[key] = e.target.value;
}

function handleCreationSave() {
    safeOperation(() => {
        kingdom.baseCulture = parseInt(document.getElementById("result-culture").textContent);
        kingdom.baseEconomy = parseInt(document.getElementById("result-economy").textContent);
        kingdom.baseLoyalty = parseInt(document.getElementById("result-loyalty").textContent);
        kingdom.baseStability = parseInt(document.getElementById("result-stability").textContent);

        const govSkills = KINGDOM_GOVERNMENTS[document.querySelector('[data-creation-key="government"]').value]?.skills || [];
        govSkills.forEach(skillName => { if (kingdom.skills[skillName]) kingdom.skills[skillName].prof = 1; });

        const investedSkills = Array.from({ length: 4 }, (_, i) => document.getElementById(`skill-invest-${i + 1}`).value).filter(Boolean);
        investedSkills.forEach(skillName => { if (kingdom.skills[skillName]) kingdom.skills[skillName].prof = 1; });

        saveState();
        renderAll();
        UIkit.notification({ message: "Kingdom created and saved!", status: "success" });
        UIkit.tab("#main-tabs").show(0);
        A11yHelpers.announceStateChange("Kingdom creation saved");
    }, "Error saving kingdom creation");
}

function initEventListeners() {
    // Kingdom Sheet Events
    document.getElementById("kingdom-sheet-content").addEventListener("click", (e) => {
    if (e.target.id === 'kingdom-level-up-btn') {
        handleLevelUp();
        return;
    }
        const leaderButton = e.target.closest("button[data-role]");
        if (leaderButton) {
            showEditLeaderModal(leaderButton.dataset.role);
            return;
        }
        const resourceButton = e.target.closest("button[data-resource]");
        if (resourceButton) {
            const resource = resourceButton.dataset.resource;
            if (resourceButton.dataset.action === "increase") kingdom[resource]++;
            else if (resourceButton.dataset.action === "decrease") kingdom[resource] = Math.max(0, kingdom[resource] - 1);
            saveState();
            renderSpecific(["kingdom"]);
        }
    });

    document.getElementById("kingdom-sheet-content").addEventListener("input", (e) => {
        const key = e.target.dataset.key;
        if (!key || !(key in kingdom)) return;
        handleValidatedInput(e.target, (value) => {
            if (key === 'level') return Validators.validateLevel(value);
            if (key === 'name') return Validators.validateKingdomName(value);
            return true;
        }, (value) => {
            kingdom[key] = value;
            saveState();
        });
    });

    // Turn Tracker Events
    document.getElementById("turn-tracker-content").addEventListener("click", (e) => {
        if (e.target.id === "clear-turn-btn") clearTurn();
        if (e.target.id === "save-turn-btn") saveTurn();
        if (e.target.id === 'upkeep-roll-resources') handleResourceRoll();
        if (e.target.id === 'upkeep-pay-consumption') handlePayConsumption();
    if (e.target.id === 'upkeep-apply-unrest') handleApplyUpkeepEffects();
if (e.target.id === 'event-check-event') handleEventCheck();
    });

    document.getElementById("turn-tracker-content").addEventListener("input", (e) => {
        const { key } = e.target.dataset;
        if (!key) return;
        if (e.target.type === "checkbox") {
            turnData[key] = e.target.checked;
        } else {
            turnData[key] = e.target.value;
        }
    });

    // Creation & Advancement Events
    document.getElementById("creation-content").addEventListener("input", (e) => {
        // This listener handles the live calculation of ability scores during creation
        if (e.target.matches("[data-creation-key]")) {
            calculateAndRenderCreationScores();
            updateSkillInvestmentDropdowns();
        }

        const advLevel = e.target.dataset.advLevel;
        const advKey = e.target.dataset.advKey;
        if (advLevel && advKey) {
            kingdom.advancement[advLevel][advKey] = e.target.value;
            saveState();
            renderSpecific(["skills"]);
        }
    });

    // Save Management Events
    document.getElementById("save-management-content").addEventListener("click", (e) => {
        if (e.target.id === "reset-kingdom-btn") resetKingdom();
        if (e.target.id === "export-btn") exportState();
        if (e.target.id === "import-btn") importState();
        if (e.target.id === "recover-btn") recoverFromBackup();
    });

    // Settlements Events
    document.getElementById("settlements-content").addEventListener("click", (e) => {
        if (e.target.id === "add-settlement-btn") {
            addSettlement();
            return;
        }
        const lotButton = e.target.closest(".grid-lot");
        if (lotButton) {
            showEditLotModal(lotButton.dataset.settlementId, parseInt(lotButton.dataset.lotIndex, 10));
            return;
        }
        const deleteButton = e.target.closest("[data-delete-settlement-id]");
        if (deleteButton) {
            e.preventDefault();
            e.stopPropagation();
            deleteSettlement(deleteButton.dataset.deleteSettlementId);
        }
    });

    // Armies Events
    document.getElementById("armies-content").addEventListener("click", (e) => {
        if (e.target.id === "add-army-btn") {
            showArmyModal();
            return;
        }
        const editButton = e.target.closest("[data-edit-army-id]");
        if (editButton) {
            showArmyModal(parseInt(editButton.dataset.editArmyId));
            return;
        }
        const deleteButton = e.target.closest("[data-delete-army-id]");
        if (deleteButton) {
            deleteArmy(parseInt(deleteButton.dataset.deleteArmyId));
        }
    });
}

// ==========================================
// INITIALIZATION
// ==========================================

function setupAutoSave() {
  setInterval(() => {
    saveState();
  }, 30000); // Auto-save every 30 seconds
}

function initializeApplication() {
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