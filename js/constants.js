// ==========================================

export const LOCAL_STORAGE_KEY = "pf2eKingdomTrackerData";
export const DATA_VERSION = "1.1.0"; // Note: Ensure migration logic matches version changes

export const defaultKingdomData = {
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

export const KINGDOM_SKILLS = {
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

export const KINGDOM_ACTIVITIES = {
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

export const RANDOM_KINGDOM_EVENTS = [
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

export const KINGDOM_FEATS = [
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

export const PROFICIENCY_RANKS = [
  "Untrained",
  "Trained",
  "Expert",
  "Master",
  "Legendary",
];

export const KINGDOM_CHARTERS = {
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

export const KINGDOM_HEARTLANDS = {
  forest_swamp: { name: "Forest or Swamp", boost: "culture" },
  hill_plain: { name: "Hill or Plain", boost: "loyalty" },
  lake_river: { name: "Lake or River", boost: "economy" },
  mountain_ruins: { name: "Mountain or Ruins", boost: "stability" },
};

export const KINGDOM_GOVERNMENTS = {
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

export const KINGDOM_ADVANCEMENT_TABLE = [
  { level: 1, dc: 14 }, { level: 2, dc: 15 }, { level: 3, dc: 16 },
  { level: 4, dc: 18 }, { level: 5, dc: 20 }, { level: 6, dc: 22 },
  { level: 7, dc: 23 }, { level: 8, dc: 24 }, { level: 9, dc: 26 },
  { level: 10, dc: 27 }, { level: 11, dc: 28 }, { level: 12, dc: 30 },
  { level: 13, dc: 31 }, { level: 14, dc: 32 }, { level: 15, dc: 34 },
  { level: 16, dc: 35 }, { level: 17, dc: 36 }, { level: 18, dc: 38 },
  { level: 19, dc: 39 }, { level: 20, dc: 40 },
];

export const KINGDOM_SIZE_TABLE = [
  { min: 1, max: 9, mod: 0, die: 4, storage: 4 },
  { min: 10, max: 24, mod: 1, die: 6, storage: 8 },
  { min: 25, max: 49, mod: 2, die: 8, storage: 12 },
  { min: 50, max: 99, mod: 3, die: 10, storage: 16 },
  { min: 100, max: Infinity, mod: 4, die: 12, storage: 20 },
];

export const structureColors = {
  Residential: "#dcedc8", Infrastructure: "#b3e5fc",
  Commercial: "#fff9c4", Government: "#cfd8dc",
  Defensive: "#ffcdd2", Industrial: "#d7ccc8",
  Magical: "#e1bee7", Demolish: "#ef5350",
};

// In script.js, replace the existing constant with this:

export const availableStructures = [
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
