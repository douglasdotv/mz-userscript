const SWAL_CONSTANTS = {
    ICONS: {
        SUCCESS: 'success',
        ERROR: 'error',
        WARNING: 'warning'
    }
};
const SWAL_CUSTOM_CLASS = {
    popup: 'swal-mz-popup',
    title: 'swal-mz-title',
    htmlContainer: 'swal-mz-html-container',
    input: 'swal-mz-input',
    validationMessage: 'swal-mz-validation',
    actions: 'swal-mz-actions',
    confirmButton: 'swal-mz-confirm',
    cancelButton: 'swal-mz-cancel',
    closeButton: 'swal-mz-close'
};
const OUTFIELD_PLAYERS_SELECTOR = ".fieldpos.fieldpos-ok.ui-draggable:not(.substitute):not(.goalkeeper):not(.substitute.goalkeeper), .fieldpos.fieldpos-collision.ui-draggable:not(.substitute):not(.goalkeeper):not(.substitute.goalkeeper)";
const GOALKEEPER_SELECTOR = ".fieldpos.fieldpos-ok.goalkeeper.ui-draggable";
const FORMATION_TEXT_SELECTOR = "#formation_text";
const TACTIC_SLOT_SELECTOR = ".ui-state-default.ui-corner-top.ui-tabs-selected.ui-state-active.invalid";
const MIN_OUTFIELD_PLAYERS = 10;
const MAX_TACTIC_NAME_LENGTH = 50;
const TACTICS_BOX = document.getElementById("tactics_box");
const TACTICS_PRESET = document.getElementById("tactics_preset");
const DEFAULT_TACTICS_DATA_URL = "https://u18mz.vercel.app/mz/userscript/tactics/json/defaultTactics.json";
const LANG_DATA_BASE_URL = "https://u18mz.vercel.app/mz/userscript/tactics/json/lang/";
const BASE_FLAG_URL = "https://raw.githubusercontent.com/lipis/flag-icons/d6785f2434e54e775d55a304733d17b048eddfb5/flags/4x3/";
const AUDIO_URLS = [
    "https://ia801901.us.archive.org/31/items/corp.-palm-mall-01-palm-mall/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20Palm%20Mall%20-%2003%20Special%20Discount.mp3",
    "https://ia801901.us.archive.org/31/items/corp.-palm-mall-01-palm-mall/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20Palm%20Mall%20-%2004%20First%20Floor.mp3",
    "https://ia801901.us.archive.org/31/items/corp.-palm-mall-01-palm-mall/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20Palm%20Mall%20-%2006%20Second%20Floor.mp3",
    "https://ia801901.us.archive.org/7/items/palm-mall-mars-remastered/%E7%8C%AB%20%E3%82%B7%20Corp.%20%26%20SEPHORA%E8%84%B3%E3%83%90%E3%82%A4%E3%83%96%E3%82%B9%20-%20Palm%20Mall%20Mars%20%28remastered%29%20-%2006%20Second%20floor-%20%ED%99%98%EB%8C%80%20%26%20%EC%9D%8C%EC%95%85.mp3",
    "https://ia801901.us.archive.org/7/items/palm-mall-mars-remastered/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20Palm%20Mall%20Mars%20%28remastered%29%20-%2001%20%E3%82%B9%E3%82%AD%E3%83%9D%E3%83%BC%E3%83%AB%E7%A9%BA%E6%B8%AFPlaza.mp3",
    "https://ia801901.us.archive.org/7/items/palm-mall-mars-remastered/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20Palm%20Mall%20Mars%20%28remastered%29%20-%2009%20Sembikiya%20Restaurant.mp3",
    "https://ia804504.us.archive.org/20/items/5-wn9896/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%20%40%20%E3%83%98%E3%83%AB%E3%82%B7%E3%83%B3%E3%82%AD%20-%2001%20FORUM%20%E6%B6%88%E8%B2%BB%E8%80%85-kuluttaja-.mp3",
    "https://ia904504.us.archive.org/20/items/5-wn9896/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%20%40%20%E3%83%98%E3%83%AB%E3%82%B7%E3%83%B3%E3%82%AD%20-%2002%20Pelican%20Self%20Storage%20-Tilaa%20Kaikelle-.mp3",
    "https://ia904504.us.archive.org/20/items/5-wn9896/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%20%40%20%E3%83%98%E3%83%AB%E3%82%B7%E3%83%B3%E3%82%AD%20-%2003%20%E8%B2%B7%E3%81%86%40JUMBO%20-Kauppakeskus-.mp3",
    "https://ia904504.us.archive.org/20/items/5-wn9896/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%20%40%20%E3%83%98%E3%83%AB%E3%82%B7%E3%83%B3%E3%82%AD%20-%2005%20Hesburger%20%E6%98%A0%E7%94%BB%E9%A4%A8%20-hampurilainen-.mp3",
    "https://ia804504.us.archive.org/20/items/5-wn9896/%E7%8C%AB%20%E3%82%B7%20Corp.%20-%20%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97%20%40%20%E3%83%98%E3%83%AB%E3%82%B7%E3%83%B3%E3%82%AD%20-%2006%20%E9%83%BD%E5%B8%82%E3%83%95%E3%82%A9%E3%83%BC%E3%83%A9%E3%83%A0%20Consumer%20-kahvi-.mp3"
];
const VERSION = "9.0.0";
const VERSION_KEY = "mz_tactics_version";
