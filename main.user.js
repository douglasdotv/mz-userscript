// ==UserScript==
// @name         MZ Tactics Manager
// @namespace    douglaskampl
// @version      9.0.0
// @description  Lets you manage your tactics in ManagerZone
// @author       Douglas
// @match        https://www.managerzone.com/?p=tactics
// @match        https://www.managerzone.com/?p=national_teams&sub=tactics&type=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=managerzone.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @require      https://unpkg.com/jssha@3.3.0/dist/sha256.js
// @require      https://unpkg.com/i18next@21.6.3/i18next.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license      MIT
// ==/UserScript==

(function () {
  "use strict";

  window.addEventListener("load", function () {
    initialize();
  });
})();
