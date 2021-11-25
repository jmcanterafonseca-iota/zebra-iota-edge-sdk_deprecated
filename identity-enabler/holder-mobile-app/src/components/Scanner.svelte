<script>
    import { Plugins } from '@capacitor/core';
    import { createEventDispatcher, onMount } from 'svelte';
    import { BrowserMultiFormatReader } from '@zxing/library';
    import { __ANDROID__, __WEB__ } from '../lib/platforms';

    const dispatch = createEventDispatcher();

    let camera;
    let cameraError = false;

    const startScan3 = async (init) => {
        const _capture = async () => {
            if (camera) {
                const camCapture = await camera.capture();
                const img = new Image();
                img.src = `data:image/jpeg;base64,${camCapture.value}`; // comment For testing
                console.log("IMG", img);

                const reader = new BrowserMultiFormatReader();
                const result = await reader.decodeFromImage(img);
                if (result) {                    
                    console.log("result", result);
                    dispatch('message', result.text);

                    camera.stop();
                    camera = null;
                } else {
                    requestAnimationFrame(startScan3);
                }
            }
        };

        if (typeof init === 'boolean') {
        try {
            const { CameraPreview } = Plugins;
            camera = CameraPreview;
            await camera.start({ position: 'rear', toBack: true, quality: 100 });

            setTimeout(async () => {
                try {
                    await _capture();
                } catch (err) {
                    requestAnimationFrame(startScan3);
                }
            }, 500);
        } catch (err) {
            cameraError = true;
            console.log(err);
        }} else {
            try {
                await _capture();
            } catch (err) {
                requestAnimationFrame(startScan3);
            }
        }
    }

    onMount(() => {
        startScan3(true);

        return () => {
            if (camera) {
                camera.stop();
                camera = null;
            }
        };
    });
</script>

<style>
    main {
        height: 85vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    main.error {
        background: var(--bg);
    }

    p {
        text-align: center;
        vertical-align: middle;
        line-height: 85vh;
        font-family: 'Proxima Nova', sans-serif;
        font-size: 6vw;
        color: #131f37;
    }
</style>

<main class:error="{cameraError}">
    {#if cameraError}
        <p>Camera not authorised</p>
    {/if}
</main>
