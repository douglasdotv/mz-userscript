function isFootball() {
    const element = document.querySelector("div#tactics_box.soccer.clearfix");
    return !!element;
}
function showAlert(options) {
    const defaultOptions = {
        customClass: SWAL_CUSTOM_CLASS,
        buttonsStyling: true,
        showClass: {
            popup: 'swal-mz-popup modalFadeIn'
        },
        hideClass: {
            popup: 'modalFadeOut'
        },
        allowOutsideClick: true,
        allowEscapeKey: true,
        width: '300px',
        padding: '10px',
    };
    if (options.customClass) {
        options.customClass = { ...SWAL_CUSTOM_CLASS, ...options.customClass };
    }
    return Swal.fire({
        ...defaultOptions,
        ...options
    });
}
function showSuccessMessage(title, text) {
    return showAlert({
        title,
        text,
        icon: SWAL_CONSTANTS.ICONS.SUCCESS
    });
}
function showErrorMessage(title, text) {
    return showAlert({
        title,
        text,
        icon: SWAL_CONSTANTS.ICONS.ERROR,
    });
}
function sha256Hash(str) {
    const shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(str);
    const hash = shaObj.getHash("HEX");
    return hash;
}
function generateUniqueId(coordinates) {
    const sortedCoordinates = coordinates.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    const coordString = sortedCoordinates.map((coord) => coord[1] + "_" + coord[0]).join("_");
    return sha256Hash(coordString);
}
