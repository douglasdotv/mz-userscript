async function fetchTacticsFromGMStorage() {
    const storedTactics = GM_getValue("ls_tactics");
    if (storedTactics) {
        return storedTactics;
    } else {
        const jsonTactics = await fetchTacticsFromJson();
        storeTacticsInGMStorage(jsonTactics);
        return jsonTactics;
    }
}
async function fetchTacticsFromJson() {
    const response = await fetch(defaultTacticsDataUrl);
    return await response.json();
}
function storeTacticsInGMStorage(data) {
    GM_setValue("ls_tactics", data);
}
async function validateDuplicateTactic(id) {
    const tacticsData = (await GM_getValue("ls_tactics")) || { tactics: [] };
    return tacticsData.tactics.some((tactic) => tactic.id === id);
}
async function saveTacticToStorage(tactic) {
    const tacticsData = (await GM_getValue("ls_tactics")) || { tactics: [] };
    tacticsData.tactics.push(tactic);
    await GM_setValue("ls_tactics", tacticsData);
}
async function validateDuplicateTacticWithUpdatedCoord(newId, selectedTac, tacticsData) {
    if (newId === selectedTac.id) {
        return "unchanged";
    } else if (tacticsData.tactics.some((tac) => tac.id === newId)) {
        return "duplicate";
    } else {
        return "unique";
    }
}
