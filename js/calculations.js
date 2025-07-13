import { kingdom, turnData } from "./state.js";
import { availableStructures, PROFICIENCY_RANKS, KINGDOM_SKILLS, KINGDOM_SIZE_TABLE, KINGDOM_ADVANCEMENT_TABLE } from "./constants.js";

// CALCULATIONS
// ==========================================

export function calculateStructureBonuses() {
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

export function calculateConsumption() {
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

export function getAbilityModifier(score) {
  return Math.floor((score - 10) / 2);
}

export function calculateSkillModifiers() {
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

export function calculateControlDC() {
  const levelDC = KINGDOM_ADVANCEMENT_TABLE.find(row => row.level === kingdom.level)?.dc || 14;
  const sizeMod = KINGDOM_SIZE_TABLE.find(row => kingdom.size >= row.min && kingdom.size <= row.max)?.mod || 0;
  return levelDC + sizeMod;
}

export function checkFeatPrerequisites(feat) {
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

export function updateRuin(ruinType, amount) {
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

export function isSettlementOvercrowded(settlement) {
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
