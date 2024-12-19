async function checkVersion() {
    const storedVersion = GM_getValue(VERSION_KEY, null);

    if (!storedVersion || storedVersion !== VERSION) {
        await showWelcomeMessage();
        GM_setValue(VERSION_KEY, VERSION);
    }
}
async function showWelcomeMessage() {
    await showAlert({
        html: `
            <div style="text-align: left; margin: 1em 0;">
                <p>${strings.welcomeMessage}</p>
            </div>
        `,
        icon: 'info',
        confirmButtonText: strings.welcomeGotIt,
        customClass: {
            popup: 'swal-mz-popup',
            confirmButton: 'swal-mz-confirm'
        },
        showClass: {
            popup: 'swal-mz-popup modalFadeIn'
        },
        hideClass: {
            popup: 'modalFadeOut'
        }
    });
}
