function handleTacticsSelection(tactic) {
    const outfieldPlayers = Array.from(document.querySelectorAll(OUTFIELD_PLAYERS_SELECTOR));
    const selectedTactic = dropdownMenuTactics.find((tacticData) => tacticData.name === tactic);
    if (selectedTactic) {
        if (outfieldPlayers.length < MIN_OUTFIELD_PLAYERS) {
            const hiddenTriggerButton = document.getElementById("hidden_trigger_button");
            hiddenTriggerButton.click();
            setTimeout(() => rearrangePlayers(selectedTactic.coordinates), 1);
        } else {
            rearrangePlayers(selectedTactic.coordinates);
        }
    }
}
function rearrangePlayers(coordinates) {
    const outfieldPlayers = Array.from(document.querySelectorAll(OUTFIELD_PLAYERS_SELECTOR));
    findBestPositions(outfieldPlayers, coordinates);
    for (let i = 0; i < outfieldPlayers.length; ++i) {
        outfieldPlayers[i].style.left = coordinates[i][0] + "px";
        outfieldPlayers[i].style.top = coordinates[i][1] + "px";
        removeCollision(outfieldPlayers[i]);
    }
    removeTacticSlotInvalidStatus();
    updateFormationText(getFormation(coordinates));
}
function findBestPositions(players, coordinates) {
    players.sort((a, b) => parseInt(a.style.top) - parseInt(b.style.top));
    coordinates.sort((a, b) => a[1] - b[1]);
}
function removeCollision(player) {
    if (player.classList.contains("fieldpos-collision")) {
        player.classList.remove("fieldpos-collision");
        player.classList.add("fieldpos-ok");
    }
}
function removeTacticSlotInvalidStatus() {
    const slot = document.querySelector(TACTIC_SLOT_SELECTOR);
    if (slot) {
        slot.classList.remove("invalid");
    }
}
function updateFormationText(formation) {
    const formationTextElement = document.querySelector(FORMATION_TEXT_SELECTOR);
    formationTextElement.querySelector(".defs").textContent = formation.defenders;
    formationTextElement.querySelector(".mids").textContent = formation.midfielders;
    formationTextElement.querySelector(".atts").textContent = formation.strikers;
}
function getFormation(coordinates) {
    let strikers = 0;
    let midfielders = 0;
    let defenders = 0;
    for (const coo of coordinates) {
        const y = coo[1];
        if (y < 103) {
            strikers++;
        } else if (y <= 204) {
            midfielders++;
        } else {
            defenders++;
        }
    }
    return { strikers, midfielders, defenders };
}
function validateTacticPlayerCount(outfieldPlayers) {
    const isGoalkeeper = document.querySelector(GOALKEEPER_SELECTOR);
    outfieldPlayers = outfieldPlayers.filter((player) => !player.classList.contains("fieldpos-collision"));
    if (outfieldPlayers.length < MIN_OUTFIELD_PLAYERS || !isGoalkeeper) {
        showErrorMessage(strings.errorTitle, strings.invalidTacticError);
        return false;
    }
    return true;
}
