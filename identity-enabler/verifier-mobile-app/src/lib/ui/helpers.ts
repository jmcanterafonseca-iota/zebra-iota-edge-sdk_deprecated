import { Plugins } from '@capacitor/core';

export async function showAlert(title: string, message: string) {
    const { Modals } = Plugins;
    await Modals.alert({ title, message });
}

export async function playAudio(sound: string) {
    console.log('Play Audio');

    const audio = new Audio();
    audio.onerror = (e) => {
        console.log("Audio Error", e);
        throw e;
    };

    audio.src = `../assets/audio/${sound}.wav`;

    await audio.play();
}
