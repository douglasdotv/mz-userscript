function initialize() {
    if (TACTICS_BOX) {
        activeLanguage = getActiveLanguage();
        i18next.init({
            lng: activeLanguage,
            resources: {
                [activeLanguage]: {
                    translation: {}
                }
            }
        }).then(async () => {
            await checkVersion();
            const res = await fetch(LANG_DATA_BASE_URL + activeLanguage + ".json");
            const json = await res.json();
            i18next.addResourceBundle(activeLanguage, "translation", json);
            const mainContainer = createMainContainer();
            const panelVisible = GM_getValue("panel_visible", true);
            if (!panelVisible) {
                mainContainer.classList.add("mz-hidden");
            }
            const toggleButton = createGlobalToggleButton(mainContainer);
            if (isFootball()) {
                insertAfterElement(toggleButton, TACTICS_BOX);
                insertAfterElement(mainContainer, toggleButton);
            }
            fetchTacticsFromGMStorage().then((data) => {
                const tacticsDropdownMenu = document.getElementById("tactics_dropdown_menu");
                tacticsDropdownMenu.addEventListener('click', function () {
                    if (this.value) {
                        handleTacticsSelection(this.value);
                    }
                });
                dropdownMenuTactics = data.tactics;
                dropdownMenuTactics.sort((a, b) => a.name.localeCompare(b.name));
                addTacticsToDropdownMenu(tacticsDropdownMenu, dropdownMenuTactics);
                tacticsDropdownMenu.addEventListener("change", function () {
                    handleTacticsSelection(this.value);
                });
            }).catch((_) => { });
            setInfoModal();
            setUsefulLinksModal();
            setUpModalsWindowClickListener();
            updateTranslation();
        });
    }
}
function createMainContainer() {
    const container = document.createElement("div");
    container.id = "mz_tactics_panel";
    container.classList.add("mz-panel");
    const tacticGroup = document.createElement("div");
    tacticGroup.classList.add("mz-group");
    const tacticGroupTitle = document.createElement("h3");
    tacticGroupTitle.classList.add("mz-group-title");
    tacticGroupTitle.textContent = strings.tacticActionsTitle;
    const dropdownSection = document.createElement("div");
    const tacticsDropdownMenuLabel = createDropdownMenuLabel("tactics_dropdown_menu_label");
    const tacticsDropdownMenu = createTacticsDropdownMenu();
    const tacticsDropdownGroup = createLabelDropdownMenuGroup(tacticsDropdownMenuLabel, tacticsDropdownMenu);
    dropdownSection.appendChild(tacticsDropdownGroup);
    const buttonsSection = document.createElement("div");
    buttonsSection.style.marginTop = "10px";
    const addNewTacticBtn = createAddNewTacticButton();
    const addNewTacticWithXmlBtn = createAddNewTacticWithXmlButton();
    const deleteTacticBtn = createDeleteTacticButton();
    const renameTacticBtn = createRenameTacticButton();
    const updateTacticBtn = createUpdateTacticButton();
    const clearTacticsBtn = createClearTacticsButton();
    const resetTacticsBtn = createResetTacticsButton();
    const importTacticsBtn = createImportTacticsButton();
    const exportTacticsBtn = createExportTacticsButton();
    appendChildren(buttonsSection, [
        addNewTacticBtn,
        addNewTacticWithXmlBtn,
        deleteTacticBtn,
        renameTacticBtn,
        updateTacticBtn,
        clearTacticsBtn,
        resetTacticsBtn,
        importTacticsBtn,
        exportTacticsBtn
    ]);
    appendChildren(tacticGroup, [
        tacticGroupTitle,
        dropdownSection,
        buttonsSection,
        createHiddenTriggerButton()
    ]);
    const otherGroup = document.createElement("div");
    otherGroup.classList.add("mz-group");
    const otherGroupTitle = document.createElement("h3");
    otherGroupTitle.classList.add("mz-group-title");
    otherGroupTitle.textContent = strings.otherActionsTitle;
    const otherContainer = document.createElement("div");
    otherContainer.style.display = "flex";
    otherContainer.style.justifyContent = "space-between";
    otherContainer.style.alignItems = "center";
    otherContainer.style.width = "100%";
    const otherLeftGroup = document.createElement("div");
    otherLeftGroup.style.display = "flex";
    otherLeftGroup.style.alignItems = "center";
    const usefulLinksBtn = createUsefulLinksButton();
    const aboutBtn = createAboutButton();
    const audioBtn = createAudioButton();
    appendChildren(otherLeftGroup, [usefulLinksBtn, aboutBtn, audioBtn]);
    const otherRightGroup = document.createElement("div");
    otherRightGroup.style.display = "flex";
    otherRightGroup.style.alignItems = "center";
    const languageDropdownMenuLabel = createDropdownMenuLabel("language_dropdown_menu_label");
    const languageDropdownMenu = createLanguageDropdownMenu();
    const languageDropdownGroup = createLabelDropdownMenuGroup(languageDropdownMenuLabel, languageDropdownMenu);
    const flagImage = createFlagImage();
    appendChildren(otherRightGroup, [languageDropdownGroup, flagImage]);
    appendChildren(otherContainer, [otherLeftGroup, otherRightGroup]);
    appendChildren(otherGroup, [otherGroupTitle, otherContainer]);
    appendChildren(container, [tacticGroup, otherGroup]);
    return container;
}
function createGlobalToggleButton(mainContainer) {
    const button = document.createElement("button");
    setUpButton(button, "mz_global_toggle_button", strings.managerTitle);
    button.style.marginLeft = "6px";
    button.style.marginTop = "6px";
    button.addEventListener("click", () => {
        const isHidden = mainContainer.classList.contains("mz-hidden");
        if (isHidden) {
            mainContainer.classList.remove("mz-hidden");
            GM_setValue("panel_visible", true);
        } else {
            mainContainer.classList.add("mz-hidden");
            GM_setValue("panel_visible", false);
        }
    });
    return button;
}
function insertAfterElement(something, element) {
    element.parentNode.insertBefore(something, element.nextSibling);
}
function createHiddenTriggerButton() {
    const button = document.createElement("button");
    button.id = "hidden_trigger_button";
    button.textContent = "";
    button.style.visibility = "hidden";
    button.addEventListener("click", function () {
        TACTICS_PRESET.value = "5-3-2";
        TACTICS_PRESET.dispatchEvent(new Event("change"));
    });
    return button;
}
function createTacticsDropdownMenu() {
    const dropdown = document.createElement("select");
    setUpDropdownMenu(dropdown, "tactics_dropdown_menu");
    appendChildren(dropdown, [createPlaceholderOption()]);
    return dropdown;
}
function createDropdownMenuLabel(labelId) {
    const label = document.createElement("span");
    setUpDropdownMenuLabel(label, labelId, strings.languageDropdownMenuLabel);
    return label;
}
function createLabelDropdownMenuGroup(label, dropdown) {
    const group = document.createElement("div");
    group.style.display = "flex";
    group.style.alignItems = "center";
    group.appendChild(label);
    group.appendChild(dropdown);
    return group;
}
function appendChildren(parent, children) {
    children.forEach((ch) => {
        parent.appendChild(ch);
    });
}
function setUpButton(button, id, textContent) {
    button.id = id;
    button.classList.add('mzbtn');
    button.textContent = textContent;
    button.style.fontFamily = "Montserrat, sans-serif";
    button.style.fontSize = "12px";
    button.style.color = "#e5e4e2";
    button.style.backgroundColor = "#11112e";
    button.style.padding = "4px 8px";
    button.style.marginLeft = "6px";
    button.style.marginTop = "6px";
    button.style.cursor = "pointer";
    button.style.border = "none";
    button.style.borderRadius = "6px";
    button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    button.style.fontWeight = "500";
    button.style.transition = "background-color 0.3s, transform 0.3s";
    button.onmouseover = function () {
        button.style.backgroundColor = "#334d77";
        button.style.transform = "scale(1.05)";
    };
    button.onmouseout = function () {
        button.style.backgroundColor = "#11112e";
        button.style.transform = "scale(1)";
    };
    button.onfocus = function () {
        button.style.outline = "2px solid #334d77";
    };
    button.onblur = function () {
        button.style.outline = "none";
    };
}
function setUpDropdownMenu(dropdown, id) {
    dropdown.id = id;
    dropdown.style.fontSize = "12px";
    dropdown.style.fontFamily = "Montserrat, sans-serif";
    dropdown.style.border = "none";
    dropdown.style.borderRadius = "6px";
    dropdown.style.backgroundColor = "#11112e";
    dropdown.style.color = "#e5e4e2";
    dropdown.style.padding = "3px 6px";
    dropdown.style.margin = "6px 0 6px 6px";
    dropdown.style.cursor = "pointer";
    dropdown.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    dropdown.style.outline = "none";
    dropdown.style.transition = "background-color 0.3s";
    dropdown.onmouseover = function () {
        dropdown.style.backgroundColor = "#334d77";
    };
    dropdown.onmouseout = function () {
        dropdown.style.backgroundColor = "#11112e";
    };
    dropdown.onfocus = function () {
        dropdown.style.outline = "2px solid #334d77";
    };
    dropdown.onblur = function () {
        dropdown.style.outline = "none";
    };
}
function createPlaceholderOption() {
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    return placeholderOption;
}
function addTacticsToDropdownMenu(dropdown, tactics) {
    for (const tactic of tactics) {
        const option = document.createElement("option");
        option.value = tactic.name;
        option.text = tactic.name;
        dropdown.appendChild(option);
    }
}
function setUpDropdownMenuLabel(description, id, textContent) {
    description.id = id;
    description.textContent = textContent;
    description.style.fontFamily = "Montserrat, sans-serif";
    description.style.fontSize = "13px";
    description.style.color = "#11112e";
    description.style.margin = "6px 0 12px 6px";
}
function createLanguageDropdownMenu() {
    const dropdown = document.createElement("select");
    setUpDropdownMenu(dropdown, "language_dropdown_menu");
    for (const lang of languages) {
        const option = document.createElement("option");
        option.value = lang.code;
        option.textContent = lang.name;
        if (lang.code === activeLanguage) {
            option.selected = true;
        }
        dropdown.appendChild(option);
    }
    dropdown.addEventListener("change", function () {
        changeLanguage(this.value).catch((_) => { });
    });
    return dropdown;
}
function createFlagImage() {
    const img = document.createElement("img");
    img.id = "language_flag";
    img.style.height = "15px";
    img.style.width = "25px";
    img.style.margin = "9px 0 6px 6px";
    img.style.border = "1px solid lightgray";
    img.style.borderRadius = "2px";
    img.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    const activeLang = languages.find((lang) => lang.code === activeLanguage);
    if (activeLang) {
        img.src = activeLang.flag;
    }
    return img;
}
