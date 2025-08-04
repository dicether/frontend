export function playFromBegin(audio: HTMLAudioElement) {
    audio.currentTime = 0;
    void audio.play();
}
