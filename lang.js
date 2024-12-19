let dropdownMenuTactics = [];
let activeLanguage;
const languages = [
    { code: "en", name: "English", flag: BASE_FLAG_URL + "gb.svg" },
    { code: "pt", name: "Português", flag: BASE_FLAG_URL + "br.svg" },
    { code: "zh", name: "中文", flag: BASE_FLAG_URL + "cn.svg" },
    { code: "sv", name: "Svenska", flag: BASE_FLAG_URL + "se.svg" },
    { code: "no", name: "Norsk", flag: BASE_FLAG_URL + "no.svg" },
    { code: "da", name: "Dansk", flag: BASE_FLAG_URL + "dk.svg" },
    { code: "es", name: "Español", flag: BASE_FLAG_URL + "ar.svg" },
    { code: "pl", name: "Polski", flag: BASE_FLAG_URL + "pl.svg" },
    { code: "nl", name: "Nederlands", flag: BASE_FLAG_URL + "nl.svg" },
    { code: "id", name: "Bahasa Indonesia", flag: BASE_FLAG_URL + "id.svg" },
    { code: "de", name: "Deutsch", flag: BASE_FLAG_URL + "de.svg" },
    { code: "it", name: "Italiano", flag: BASE_FLAG_URL + "it.svg" },
    { code: "fr", name: "Français", flag: BASE_FLAG_URL + "fr.svg" },
    { code: "ro", name: "Română", flag: BASE_FLAG_URL + "ro.svg" },
    { code: "tr", name: "Türkçe", flag: BASE_FLAG_URL + "tr.svg" },
    { code: "ko", name: "한국어", flag: BASE_FLAG_URL + "kr.svg" },
    { code: "ru", name: "Русский", flag: BASE_FLAG_URL + "ru.svg" },
    { code: "ar", name: "العربية", flag: BASE_FLAG_URL + "sa.svg" },
    { code: "jp", name: "日本語", flag: BASE_FLAG_URL + "jp.svg" },
];
const strings = {
    addButton: "Add Tactic",
    addWithXmlButton: "Add Tactic via XML",
    deleteButton: "Delete Tactic",
    renameButton: "Rename Tactic",
    updateButton: "Update Tactic",
    clearButton: "Clear Tactics",
    resetButton: "Reset Tactics",
    importButton: "Import Tactics",
    exportButton: "Export Tactics",
    usefulLinksButton: "Useful Links",
    aboutButton: "About",
    tacticNamePrompt: "Tactic Name:",
    addAlert: "Tactic {} added successfully.",
    deleteAlert: "Tactic {} deleted successfully.",
    renameAlert: "Tactic {} renamed to {} successfully.",
    updateAlert: "Tactic {} updated successfully.",
    clearAlert: "Tactics cleared successfully.",
    resetAlert: "Tactics reset successfully.",
    importAlert: "Tactics imported successfully.",
    exportAlert: "Tactics exported successfully.",
    deleteConfirmation: "Do you really want to delete {}?",
    updateConfirmation: "Do you really want to update {}?",
    clearConfirmation: "Do you really want to clear tactics?",
    resetConfirmation: "Do you really want to reset tactics?",
    invalidTacticError: "Invalid tactic.",
    noTacticNameProvidedError: "No tactic name provided.",
    alreadyExistingTacticNameError: "Tactic name already exists.",
    tacticNameMaxLengthError: "Tactic name is too long.",
    noTacticSelectedError: "No tactic selected.",
    duplicateTacticError: "Duplicate tactic.",
    noChangesMadeError: "No changes made.",
    invalidImportError: "Invalid import file.",
    modalContentInfoText: "This is the tactic selector.",
    modalContentFeedbackText: "Send your feedback.",
    usefulContent: "Some useful links:",
    tacticsDropdownMenuLabel: "Tactics:",
    languageDropdownMenuLabel: "Language:",
    errorTitle: "Error",
    doneTitle: "Done",
    confirmationTitle: "Confirmation",
    deleteTacticConfirmButton: "Delete",
    cancelConfirmButton: "Cancel",
    updateConfirmButton: "Update",
    clearTacticsConfirmButton: "Clear",
    resetTacticsConfirmButton: "Reset",
    addConfirmButton: "Add",
    xmlValidationError: "Invalid XML.",
    xmlParsingError: "Error parsing XML.",
    xmlPlaceholder: "Paste XML here",
    tacticNamePlaceholder: "Name",
    managerTitle: "MZ Tactics Manager",
    tacticActionsTitle: "Actions",
    otherActionsTitle: "Other",
    welcomeMessage: "Welcome to MZ Tactics Manager! Hope you enjoy using it!",
    welcomeGotIt: "Got it!"
};
const elementStringKeys = {
    add_tactic_button: "addButton",
    add_tactic_with_xml_button: "addWithXmlButton",
    delete_tactic_button: "deleteButton",
    rename_tactic_button: "renameButton",
    update_tactic_button: "updateButton",
    clear_tactics_button: "clearButton",
    reset_tactics_button: "resetButton",
    import_tactics_button: "importButton",
    export_tactics_button: "exportButton",
    about_button: "aboutButton",
    tactics_dropdown_menu_label: "tacticsDropdownMenuLabel",
    language_dropdown_menu_label: "languageDropdownMenuLabel",
    info_modal_info_text: "modalContentInfoText",
    info_modal_feedback_text: "modalContentFeedbackText",
    useful_links_button: "usefulLinksButton",
    useful_content: "usefulContent",
};
function getActiveLanguage() {
    let language = GM_getValue("language");
    if (!language) {
        let browserLanguage = navigator.language || "en";
        browserLanguage = browserLanguage.split("-")[0];
        const languageExists = languages.some((lang) => lang.code === browserLanguage);
        language = languageExists ? browserLanguage : "en";
    }
    return language;
}
function updateTranslation() {
    for (const key in strings) {
        strings[key] = i18next.t(key);
    }
    for (const id in elementStringKeys) {
        const element = document.getElementById(id);
        if (id === "info_modal_info_text" || id === "info_modal_feedback_text") {
            if (element) element.innerHTML = strings[elementStringKeys[id]];
        } else {
            if (element) element.textContent = strings[elementStringKeys[id]];
        }
    }
}
async function changeLanguage(languageCode) {
    try {
        const translationDataUrl = LANG_DATA_BASE_URL + languageCode + ".json";
        const translations = await (await fetch(translationDataUrl)).json();
        i18next.changeLanguage(languageCode);
        i18next.addResourceBundle(languageCode, "translation", translations);
        GM_setValue("language", languageCode);
        updateTranslation();
        const language = languages.find((lang) => lang.code === languageCode);
        if (language) {
            const flagImage = document.getElementById("language_flag");
            if (flagImage) flagImage.src = language.flag;
        }
    } catch (_e) { }
}
