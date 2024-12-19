function playRandomAudio(audios) {
    if (audios.length === 0) {
        return;
    }
    const randomIdx = Math.floor(Math.random() * audios.length);
    const activeAudio = audios.splice(randomIdx, 1)[0];
    playAudio(activeAudio, audios);
    return activeAudio;
}
function playAudio(currAudio, audios) {
    currAudio.play();
    currAudio.onended = function () {
        playRandomAudio(audios);
    };
}
function pauseAudio(audio) {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}
function updateAudioIcon(button, isPlaying) {
    button.textContent = isPlaying ? "⏸️" : "🔊";
}
function createAudioButton() {
    const button = document.createElement("button");
    setUpButton(button, "audio_button", "🔊");
    const audios = AUDIO_URLS.map(url => new Audio(url));
    let isPlaying = false;
    let currentAudio = null;
    button.addEventListener("click", function () {
        if (!isPlaying) {
            currentAudio = playRandomAudio(audios);
            isPlaying = true;
        } else {
            pauseAudio(currentAudio);
            isPlaying = false;
        }
        updateAudioIcon(button, isPlaying);
    });
    return button;
}
