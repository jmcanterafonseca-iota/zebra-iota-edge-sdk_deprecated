<script lang="ts">
    import { navigate } from "svelte-routing";
    import { fly } from "svelte/transition";
    import { loadingScreen } from "../lib/store";
    import { __ANDROID__ } from "../lib/platforms";
    import Scanner from "../components/Scanner.svelte";
    import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from "@zxing/library";
    import { handleScannerData } from "../lib/scan";
    import { playAudio } from "../lib/ui/helpers";

    const formats = new Map().set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE]);
    const reader = new BrowserMultiFormatReader(formats);

    // handles input button
    const imageSelected = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
        const image = e.currentTarget.files[0];

        const fr = new FileReader();
        fr.onload = (e: ProgressEvent<FileReader>) => {
            loadingScreen.set("Decoding image...");
            reader
                .decodeFromImageUrl(e.target.result as string)
                .then(result => handleScannerData(result.getText()))
                .catch(e => {
                    console.error(e);
                    loadingScreen.set();
                    navigate("/invalid");
                });
        };
        fr.readAsDataURL(image);
    };

    // handles Scanner message
    async function message(ev: CustomEvent) {
        await playAudio("scanned");
        await handleScannerData(ev.detail);
    }

    function goBack() {
        window.history.back();
    }
</script>

<main transition:fly={{ y: 200, duration: 500 }}>
    <header>
        <div class="options-wrapper">
            <svg
                on:click={() => navigate("/home")}
                class="arrow"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M15 6L9 12L15 18" />
            </svg>
            <p>Scanner</p>
            <label class="image-select">
                <input type="file" accept="image/*" on:change={imageSelected} />
                Browse
            </label>
        </div>
    </header>
    <Scanner on:message={message} />
</main>

<style>
    main {
        height: 100%;
        overflow: hidden;
    }

    header {
        display: flex;
        flex-direction: column;
        height: 72px;
        background-color: #6165e3;
    }

    .arrow {
        width: 1.75em;
        fill: none;
        stroke: white;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .options-wrapper > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        color: #f8f8f8;
        margin: 0;
        z-index: 1;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin: 3.5vh;
    }

    input[type="file"] {
        display: none;
    }

    .image-select {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        color: #f8f8f8;
        border: 1px solid #ccc;
        background-color: #1e22aa;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
    }
</style>
