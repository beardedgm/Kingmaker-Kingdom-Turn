import { kingdom, turnData, history, A11yHelpers, setTurnData } from "./state.js";
import { KINGDOM_ACTIVITIES, KINGDOM_SIZE_TABLE, RANDOM_KINGDOM_EVENTS } from "./constants.js";
import { calculateConsumption, updateRuin } from "./calculations.js";
import { showConfirmationModal, renderTurnTracker } from "./rendering.js";

// ==========================================
// KINGDOM CREATION LOGIC
// ==========================================

export function calculateAndRenderCreationScores() {
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

export function updateFreeBoostDropdowns(selections) {
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

export function updateSkillInvestmentDropdowns() {
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

export function clearTurn() {
    setTurnData({
        turnFame: kingdom.fame + 1,
        turnUnrest: kingdom.unrest,
        turnResourcePoints: 0,
        turnXP: 0,
        currentNotes: "",
        currentEvent: "",
        rolledResources: false,
        paidConsumption: false,
        eventChecked: false // <-- Add this line
    });
    for (const category in KINGDOM_ACTIVITIES) {
        KINGDOM_ACTIVITIES[category].forEach(activityName => {
            const key = `activity_${activityName.replace(/\s+/g, '_')}`;
            turnData[key] = false;
        });
    }
    renderTurnTracker();
}

export function saveTurn() {
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

export function handleResourceRoll() {
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

export function handlePayConsumption() {
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

export function handleApplyUpkeepEffects() {
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

export function handleEventCheck() {
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
