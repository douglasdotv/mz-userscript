GM_addStyle(`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap');
  @keyframes modalFadeIn {
    0% {opacity: 0;transform: translateY(-10px) scale(0.95);}
    100% {opacity: 1;transform: translateY(0) scale(1);}
  }
  @keyframes modalFadeOut {
    0% {opacity: 1;transform: translateY(0) scale(1);}
    100% {opacity: 0;transform: translateY(-10px) scale(0.95);}
  }
  .swal2-popup.swal-mz-popup {
    background: #1a1f36;
    border-radius: 12px;
    padding: 24px;
    width: 95%;
    max-height: 90vh;
    max-width: 300px;
    text-align: center;
    transform-origin: center center;
  }
  .swal2-popup.swal-mz-popup.modalFadeIn {
    animation: modalFadeIn 0.4s ease-out forwards;
  }
  .swal2-popup.swal-mz-popup.modalFadeOut {
    animation: modalFadeOut 0.4s ease-in forwards;
  }
  .swal2-title.swal-mz-title {
    color: #e5e7eb;
    font-family: 'Montserrat', sans-serif;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    line-height: 1.2;
  }
  .swal2-html-container.swal-mz-html-container {
    color: #94a3b8;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    margin: 12px 0;
  }
  .swal2-input.swal-mz-input,
  .swal2-textarea.swal-mz-input {
    display: block;
    background: #2a3146;
    border: 1px solid #374151;
    border-radius: 6px;
    color: #e5e7eb;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    margin: 12px auto;
    padding: 8px 12px;
    width: 80%;
    max-width: 300px;
    box-sizing: border-box;
    resize: none;
    text-align: left;
  }
  .swal2-textarea.swal-mz-input {height: 200px !important;}
  .swal2-input.swal-mz-input:focus,
  .swal2-textarea.swal-mz-input:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79,70,229,0.1);
    outline: none;
  }
  .swal2-validation-message.swal-mz-validation {
    background: #292524;
    color: #fecaca;
    font-size: 13px;
    margin: 8px 0;
    padding: 8px;
  }
  .swal2-actions.swal-mz-actions {
    margin: 24px 0 0;
    gap: 8px;
  }
  .swal2-container .swal2-actions button.swal2-styled.swal-mz-confirm,
  .swal2-container .swal2-actions button.swal2-styled.swal-mz-cancel {
    font-family: 'Montserrat', sans-serif !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    padding: 10px 20px !important;
    border-radius: 6px !important;
    margin: 0 !important;
    transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease !important;
    border: none !important;
    box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
    transform: translateY(0) !important;
    min-width: 100px !important;
    cursor: pointer;
  }
  .swal2-container .swal2-actions button.swal2-styled.swal-mz-confirm {
    background: #4f46e5 !important;
    color: white !important;
  }
  .swal2-container .swal2-actions button.swal2-styled.swal-mz-confirm:hover {
    background: #4338ca !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 12px rgba(0,0,0,0.2) !important;
  }
  .swal2-container .swal2-actions button.swal2-styled.swal-mz-cancel {
    background: #374151 !important;
    color: #e5e7eb !important;
  }
  .swal2-container .swal2-actions button.swal2-styled.swal-mz-cancel:hover {
    background: #4b5563 !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 12px rgba(0,0,0,0.2) !important;
  }
  .swal2-container .swal2-actions button.swal2-styled:focus {
    box-shadow: 0 0 0 3px rgba(79,70,229,0.3) !important;
    outline: none !important;
  }
  .mz-panel {
    background-color: #f9f9f9;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin-left: 6px;
    margin-top: 6px;
  }
  .mz-hidden {
    display: none !important;
  }
  .mz-group {
    background: #f1f1f1;
    border-radius: 8px;
    padding: 10px;
    margin: 6px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .mz-group-title {
    width: 100%;
    margin: 0 0 6px 0;
    font-family: Montserrat, sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #11112e;
    border-bottom: 1px solid #ddd;
    padding-bottom: 4px;
  }
  #mz_tactics_panel {
    transition: opacity 0.3s ease, max-height 0.3s ease;
    opacity: 1;
    max-height: 1000px;
    overflow: hidden;
  }
  #mz_tactics_panel.mz-hidden {
    opacity: 0;
    max-height: 0;
  }
`);
