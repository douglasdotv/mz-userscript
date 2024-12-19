async function addNewTactic() {
    const outfieldPlayers = Array.from(document.querySelectorAll(OUTFIELD_PLAYERS_SELECTOR));
    const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");
    const tacticCoordinates = outfieldPlayers.map((player) => [parseInt(player.style.left), parseInt(player.style.top)]);
    if (!validateTacticPlayerCount(outfieldPlayers)) {
        return;
    }
    const tacticId = generateUniqueId(tacticCoordinates);
    const isDuplicate = await validateDuplicateTactic(tacticId);
    if (isDuplicate) {
        await showErrorMessage(strings.errorTitle, strings.duplicateTacticError);
        return;
    }
    const result = await showAlert({
        title: strings.tacticNamePrompt,
        input: 'text',
        inputValue: '',
        inputValidator: (value) => {
            if (!value) {
                return strings.noTacticNameProvidedError;
            }
            if (value.length > MAX_TACTIC_NAME_LENGTH) {
                return strings.tacticNameMaxLengthError;
            }
            if (dropdownMenuTactics.some((t) => t.name === value)) {
                return strings.alreadyExistingTacticNameError;
            }
        },
        showCancelButton: true,
        confirmButtonText: strings.addConfirmButton,
        cancelButtonText: strings.cancelConfirmButton
    });
    const tacticName = result.value;
    if (!tacticName) {
        return;
    }
    const tactic = {
        name: tacticName,
        coordinates: tacticCoordinates,
        id: tacticId
    };
    await saveTacticToStorage(tactic);
    addTacticsToDropdownMenu(tacticsDropdownMenu, [tactic]);
    dropdownMenuTactics.push(tactic);
    const placeholderOption = tacticsDropdownMenu.querySelector('option[value=""]');
    if (placeholderOption) {
        placeholderOption.remove();
    }
    if (tacticsDropdownMenu.disabled) {
        tacticsDropdownMenu.disabled = false;
    }
    tacticsDropdownMenu.value = tactic.name;
    const changeEvent = new Event('change', { bubbles: true });
    tacticsDropdownMenu.dispatchEvent(changeEvent);
    handleTacticsSelection(tactic.name);
    await showSuccessMessage(strings.doneTitle, strings.addAlert.replace("{}", tactic.name));
}
async function addNewTacticWithXml() {
    const result = await showAlert({
        title: strings.addWithXmlButton,
        html:
            `<textarea id="swal-xml-input" class="swal2-textarea swal-mz-input" placeholder="${strings.xmlPlaceholder}" style="height: 200px;"></textarea>` +
            `<input id="swal-name-input" class="swal2-input swal-mz-input" placeholder="${strings.tacticNamePlaceholder}">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: strings.addConfirmButton,
        cancelButtonText: strings.cancelConfirmButton,
        preConfirm: () => {
            const xml = document.getElementById('swal-xml-input').value;
            const name = document.getElementById('swal-name-input').value;
            if (!xml) {
                Swal.showValidationMessage(strings.xmlValidationError);
                return false;
            }
            if (!name) {
                Swal.showValidationMessage(strings.noTacticNameProvidedError);
                return false;
            }
            if (name.length > MAX_TACTIC_NAME_LENGTH) {
                Swal.showValidationMessage(strings.tacticNameMaxLengthError);
                return false;
            }
            if (dropdownMenuTactics.some((t) => t.name === name)) {
                Swal.showValidationMessage(strings.alreadyExistingTacticNameError);
                return false;
            }
            return { xml, name };
        }
    });
    if (!result.value) {
        return;
    }
    try {
        const { xml, name } = result.value;
        const newTactic = await convertXmlToTacticJson(xml, name);
        const tacticId = generateUniqueId(newTactic.coordinates);
        const isDuplicate = await validateDuplicateTactic(tacticId);
        if (isDuplicate) {
            await showErrorMessage(strings.errorTitle, strings.duplicateTacticError);
            return;
        }
        newTactic.id = tacticId;
        await saveTacticToStorage(newTactic);
        const tacticsDropdownMenu = document.getElementById('tactics_dropdown_menu');
        addTacticsToDropdownMenu(tacticsDropdownMenu, [newTactic]);
        dropdownMenuTactics.push(newTactic);
        tacticsDropdownMenu.value = newTactic.name;
        handleTacticsSelection(newTactic.name);
        await showSuccessMessage(strings.doneTitle, strings.addAlert.replace('{}', newTactic.name));
    } catch (e) {
        await showErrorMessage(strings.errorTitle, strings.xmlParsingError);
    }
}
async function deleteTactic() {
    const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");
    const selectedTactic = dropdownMenuTactics.find((tactic) => tactic.name === tacticsDropdownMenu.value);
    if (!selectedTactic) {
        await showErrorMessage(strings.errorTitle, strings.noTacticSelectedError);
        return;
    }
    const result = await showAlert({
        text: strings.deleteConfirmation.replace("{}", selectedTactic.name),
        icon: SWAL_CONSTANTS.ICONS.WARNING,
        showCancelButton: true,
        confirmButtonText: strings.deleteTacticConfirmButton,
        cancelButtonText: strings.cancelConfirmButton
    });
    if (!result.isConfirmed) {
        return;
    }
    const tacticsData = (await GM_getValue("ls_tactics")) || { tactics: [] };
    tacticsData.tactics = tacticsData.tactics.filter((tactic) => tactic.id !== selectedTactic.id);
    await GM_setValue("ls_tactics", tacticsData);
    dropdownMenuTactics = dropdownMenuTactics.filter((tactic) => tactic.id !== selectedTactic.id);
    const selectedOption = Array.from(tacticsDropdownMenu.options).find((option) => option.value === selectedTactic.name);
    tacticsDropdownMenu.remove(selectedOption.index);
    if (tacticsDropdownMenu.options[0]?.disabled) {
        tacticsDropdownMenu.selectedIndex = 0;
    }
    await showSuccessMessage(strings.doneTitle, strings.deleteAlert.replace("{}", selectedTactic.name));
}
async function renameTactic() {
    const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");
    const selectedTactic = dropdownMenuTactics.find((tactic) => tactic.name === tacticsDropdownMenu.value);
    if (!selectedTactic) {
        await showErrorMessage(strings.errorTitle, strings.noTacticSelectedError);
        return;
    }
    const oldName = selectedTactic.name;
    const result = await showAlert({
        title: strings.tacticNamePrompt,
        input: 'text',
        inputValue: oldName,
        inputValidator: (value) => {
            if (!value) {
                return strings.noTacticNameProvidedError;
            }
            if (value.length > MAX_TACTIC_NAME_LENGTH) {
                return strings.tacticNameMaxLengthError;
            }
            if (value !== oldName && dropdownMenuTactics.some((t) => t.name === value)) {
                return strings.alreadyExistingTacticNameError;
            }
        },
        showCancelButton: true,
        confirmButtonText: strings.updateConfirmButton,
        cancelButtonText: strings.cancelConfirmButton
    });
    const newName = result.value;
    if (!newName) {
        return;
    }
    const selectedOption = Array.from(tacticsDropdownMenu.options).find((option) => option.value === selectedTactic.name);
    const tacticsData = (await GM_getValue("ls_tactics")) || { tactics: [] };
    tacticsData.tactics = tacticsData.tactics.map((tactic) => {
        if (tactic.id === selectedTactic.id) {
            tactic.name = newName;
        }
        return tactic;
    });
    await GM_setValue("ls_tactics", tacticsData);
    dropdownMenuTactics = dropdownMenuTactics.map((tactic) => {
        if (tactic.id === selectedTactic.id) {
            tactic.name = newName;
        }
        return tactic;
    });
    selectedOption.value = newName;
    selectedOption.textContent = newName;
    await showSuccessMessage(strings.doneTitle, strings.renameAlert.replace("{}", oldName).replace("{}", newName));
}
async function updateTactic() {
    const outfieldPlayers = Array.from(document.querySelectorAll(OUTFIELD_PLAYERS_SELECTOR));
    const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");
    const selectedTactic = dropdownMenuTactics.find((tactic) => tactic.name === tacticsDropdownMenu.value);
    if (!selectedTactic) {
        await showErrorMessage(strings.errorTitle, strings.noTacticSelectedError);
        return;
    }
    const updatedCoordinates = outfieldPlayers.map((player) => [parseInt(player.style.left), parseInt(player.style.top)]);
    const newId = generateUniqueId(updatedCoordinates);
    const tacticsData = (await GM_getValue("ls_tactics")) || { tactics: [] };
    const validationOutcome = await validateDuplicateTacticWithUpdatedCoord(newId, selectedTactic, tacticsData);
    if (validationOutcome === "unchanged") {
        await showErrorMessage(strings.errorTitle, strings.noChangesMadeError);
        return;
    } else if (validationOutcome === "duplicate") {
        await showErrorMessage(strings.errorTitle, strings.duplicateTacticError);
        return;
    }
    const result = await showAlert({
        text: strings.updateConfirmation.replace("{}", selectedTactic.name),
        icon: SWAL_CONSTANTS.ICONS.WARNING,
        showCancelButton: true,
        confirmButtonText: strings.updateConfirmButton,
        cancelButtonText: strings.cancelConfirmButton
    });
    if (!result.isConfirmed) {
        return;
    }
    for (const tactic of tacticsData.tactics) {
        if (tactic.id === selectedTactic.id) {
            tactic.coordinates = updatedCoordinates;
            tactic.id = newId;
        }
    }
    for (const tactic of dropdownMenuTactics) {
        if (tactic.id === selectedTactic.id) {
            tactic.coordinates = updatedCoordinates;
            tactic.id = newId;
        }
    }
    await GM_setValue("ls_tactics", tacticsData);
    await showSuccessMessage(strings.doneTitle, strings.updateAlert.replace("{}", selectedTactic.name));
}
async function clearTactics() {
    const result = await showAlert({
        text: strings.clearConfirmation,
        icon: SWAL_CONSTANTS.ICONS.WARNING,
        showCancelButton: true,
        confirmButtonText: strings.clearTacticsConfirmButton,
        cancelButtonText: strings.cancelConfirmButton
    });
    if (!result.isConfirmed) {
        return;
    }
    await GM_setValue("ls_tactics", { tactics: [] });
    dropdownMenuTactics = [];
    const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");
    tacticsDropdownMenu.innerHTML = "";
    tacticsDropdownMenu.disabled = true;
    await showSuccessMessage(strings.doneTitle, strings.clearAlert);
}
async function resetTactics() {
    const result = await showAlert({
        text: strings.resetConfirmation,
        icon: SWAL_CONSTANTS.ICONS.WARNING,
        showCancelButton: true,
        confirmButtonText: strings.resetTacticsConfirmButton,
        cancelButtonText: strings.cancelConfirmButton
    });
    if (!result.isConfirmed) {
        return;
    }
    const response = await fetch(DEFAULT_TACTICS_DATA_URL);
    const data = await response.json();
    const defaultTactics = data.tactics;
    await GM_setValue("ls_tactics", { tactics: defaultTactics });
    dropdownMenuTactics = defaultTactics;
    const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");
    tacticsDropdownMenu.innerHTML = "";
    tacticsDropdownMenu.appendChild(createPlaceholderOption());
    addTacticsToDropdownMenu(tacticsDropdownMenu, dropdownMenuTactics);
    tacticsDropdownMenu.disabled = false;
    await showSuccessMessage(strings.doneTitle, strings.resetAlert);
}
async function importTactics() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = async function (event) {
            let importedData;
            try {
                importedData = JSON.parse(event.target.result);
            } catch (e) {
                await showErrorMessage(strings.errorTitle, strings.invalidImportError);
                return;
            }
            if (!importedData || !Array.isArray(importedData.tactics)) {
                await showErrorMessage(strings.errorTitle, strings.invalidImportError);
                return;
            }
            const importedTactics = importedData.tactics;
            let existingTactics = await GM_getValue("ls_tactics", { tactics: [] });
            existingTactics = existingTactics.tactics;
            const mergedTactics = [...existingTactics];
            for (const importedTactic of importedTactics) {
                if (!existingTactics.some((tactic) => tactic.id === importedTactic.id)) {
                    mergedTactics.push(importedTactic);
                }
            }
            await GM_setValue("ls_tactics", { tactics: mergedTactics });
            mergedTactics.sort((a, b) => a.name.localeCompare(b.name));
            dropdownMenuTactics = mergedTactics;
            const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");
            tacticsDropdownMenu.innerHTML = "";
            tacticsDropdownMenu.append(createPlaceholderOption());
            addTacticsToDropdownMenu(tacticsDropdownMenu, dropdownMenuTactics);
            tacticsDropdownMenu.disabled = false;
            await showSuccessMessage(strings.doneTitle, strings.importAlert);
        };
        reader.readAsText(file);
    };
    input.click();
}
function exportTactics() {
    const tactics = GM_getValue("ls_tactics", { tactics: [] });
    const tacticsJson = JSON.stringify(tactics);
    const blob = new Blob([tacticsJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tactics.json";
    const onFocus = () => {
        window.removeEventListener('focus', onFocus);
        URL.revokeObjectURL(url);
    };
    window.addEventListener('focus', onFocus, { once: true });
    link.click();
}
async function convertXmlToTacticJson(xmlString, tacticName) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const parserError = xmlDoc.getElementsByTagName('parsererror');
    if (parserError.length > 0) {
        throw new Error('Invalid XML');
    }
    const posElements = Array.from(xmlDoc.getElementsByTagName('Pos'));
    const normalPosElements = posElements.filter(el => el.getAttribute('pos') === 'normal');
    const coordinates = normalPosElements.map(el => {
        const x = parseInt(el.getAttribute('x'));
        const y = parseInt(el.getAttribute('y'));
        const htmlLeft = x - 7;
        const htmlTop = y - 9;
        return [htmlLeft, htmlTop];
    });
    return {
        name: tacticName,
        coordinates: coordinates
    };
}
function createAddNewTacticButton() {
    const button = document.createElement("button");
    setUpButton(button, "add_tactic_button", strings.addButton);
    button.addEventListener("click", function () {
        addNewTactic().catch((_) => { });
    });
    return button;
}
function createAddNewTacticWithXmlButton() {
    const button = document.createElement("button");
    setUpButton(button, "add_tactic_with_xml_button", strings.addWithXmlButton);
    button.addEventListener("click", function () {
        addNewTacticWithXml().catch((_) => { });
    });
    return button;
}
function createDeleteTacticButton() {
    const button = document.createElement("button");
    setUpButton(button, "delete_tactic_button", strings.deleteButton);
    button.addEventListener("click", function () {
        deleteTactic().catch((_) => { });
    });
    return button;
}
function createRenameTacticButton() {
    const button = document.createElement("button");
    setUpButton(button, "rename_tactic_button", strings.renameButton);
    button.addEventListener("click", function () {
        renameTactic().catch((_) => { });
    });
    return button;
}
function createUpdateTacticButton() {
    const button = document.createElement("button");
    setUpButton(button, "update_tactic_button", strings.updateButton);
    button.addEventListener("click", function () {
        updateTactic().catch((_) => { });
    });
    return button;
}
function createClearTacticsButton() {
    const button = document.createElement("button");
    setUpButton(button, "clear_tactics_button", strings.clearButton);
    button.addEventListener("click", function () {
        clearTactics().catch((_) => { });
    });
    return button;
}
function createResetTacticsButton() {
    const button = document.createElement("button");
    setUpButton(button, "reset_tactics_button", strings.resetButton);
    button.addEventListener("click", function () {
        resetTactics().catch((_) => { });
    });
    return button;
}
function createImportTacticsButton() {
    const button = document.createElement("button");
    setUpButton(button, "import_tactics_button", strings.importButton);
    button.addEventListener("click", function () {
        importTactics().catch((_) => { });
    });
    return button;
}
function createExportTacticsButton() {
    const button = document.createElement("button");
    setUpButton(button, "export_tactics_button", strings.exportButton);
    button.addEventListener("click", function () {
        exportTactics();
    });
    return button;
}
