import { kingdom, turnData } from "./state.js";
import { Validators } from "./utils.js";
import { KINGDOM_GOVERNMENTS } from "./constants.js";
import { renderSpecific, showEditLeaderModal, addSettlement, showEditLotModal, deleteSettlement, showArmyModal, deleteArmy } from "./rendering.js";
import { clearTurn, saveTurn, handleResourceRoll, handlePayConsumption, handleApplyUpkeepEffects, handleEventCheck, calculateAndRenderCreationScores, updateSkillInvestmentDropdowns } from "./turn.js";

// EVENT HANDLERS & LISTENERS
// ==========================================

export function handleResourceUpdate(resource, action) {
    if (action === "increase") kingdom[resource]++;
    else if (action === "decrease") kingdom[resource] = Math.max(0, kingdom[resource] - 1);
    saveState();
    renderSpecific(["kingdom"]);
}

export function handleLevelUp() {
    if (kingdom.xp < 1000) {
        UIkit.notification({ message: "Not enough XP to level up.", status: 'warning' });
        return;
    }
    // Open the new Level Up modal instead of doing the math here
    showLevelUpModal(kingdom.level + 1);
}

export function handleKingdomInputChange(e) {
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

export function handleTurnDataUpdate(e) {
    const { key } = e.target.dataset;
    if (!key) return;
    if (e.target.type === "checkbox") turnData[key] = e.target.checked;
    else if (e.target.type === "number") turnData[key] = parseInt(e.target.value, 10) || 0;
    else turnData[key] = e.target.value;
}

export function handleCreationSave() {
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

export function initEventListeners() {
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
