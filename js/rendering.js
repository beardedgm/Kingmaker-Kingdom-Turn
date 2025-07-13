import { kingdom, turnData, history, A11yHelpers } from "./state.js";
import { availableStructures, structureColors, KINGDOM_GOVERNMENTS, KINGDOM_CHARTERS, KINGDOM_HEARTLANDS, KINGDOM_FEATS, PROFICIENCY_RANKS, KINGDOM_SIZE_TABLE, KINGDOM_SKILLS, KINGDOM_ACTIVITIES } from "./constants.js";
import { calculateStructureBonuses, calculateSkillModifiers, calculateControlDC, calculateConsumption, isSettlementOvercrowded } from "./calculations.js";
import { Validators, handleValidatedInput, debounce } from "./utils.js";

// ==========================================
// RENDERING
// ==========================================

export function renderSpecific(sections = []) {
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

export const debouncedRenderAll = debounce(renderAll, 150);
export function renderAll() {
  renderSpecific();
}

// In script.js
export function renderKingdomSheet() {
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

export function renderSkillsAndFeats() {
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

export function renderTurnTracker() {
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

export function renderHistory() {
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

export function renderSettlements() {
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

export function renderArmies() {
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

export function renderCreation() {
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

export function renderSaveManagement() {
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

export function showConfirmationModal(message, onConfirm) {
    UIkit.modal.confirm(message).then(() => {
        if (onConfirm) onConfirm();
    }, () => {});
}

export function showFormModal(title, formHtml, onSave) {
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

export function showLevelUpModal(newLevel) {
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

export function showSkillIncreaseModal(level) {
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

export function showFeatSelectionModal(level) {
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

export function showEditLeaderModal(role) {
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

export function addSettlement() {
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

export function deleteSettlement(settlementId) {
    showConfirmationModal("Are you sure you want to delete this settlement?", () => {
        const settlementName = kingdom.settlements.find(s => s.id == settlementId)?.name || "Settlement";
        kingdom.settlements = kingdom.settlements.filter(s => s.id != settlementId);
        saveState();
        renderSpecific(["settlements", "kingdom"]);
        UIkit.notification({ message: "Settlement deleted.", status: "danger" });
        A11yHelpers.announceStateChange(`${settlementName} deleted`);
    });
}

export function canPlaceStructure(settlement, startX, startY, width, height) {
  if (startX + width > settlement.gridSize || startY + height > settlement.gridSize) return false;
  for (let y = startY; y < startY + height; y++) {
    for (let x = startX; x < startX + width; x++) {
      if (settlement.lots[y * settlement.gridSize + x].buildingId) return false;
    }
  }
  return true;
}

export function placeStructure(settlementId, lotIndex, structureName) {
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

export function showEditLotModal(settlementId, lotIndex) {
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

export function showArmyModal(armyId = null) {
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

export function deleteArmy(armyId) {
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
