<script lang="ts">
    import { navigate } from 'svelte-routing';
    import { fly } from 'svelte/transition';
    import { __ANDROID__ } from '../lib/platforms';
    import Scanner from '../components/Scanner.svelte';
    import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType} from '@zxing/library';
    import { verifyCredential, CredentialVerificationError } from '../lib/verify';

    const formats = new Map().set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE]);
    const reader = new BrowserMultiFormatReader(formats);

    // handles input button
    const imageSelected = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
        const image = e.currentTarget.files[0];
        
        const fr = new FileReader();
        fr.onload = (e: ProgressEvent<FileReader>) => {
            reader.decodeFromImageUrl(e.target.result as string)
                .then(result => handleDecodedData(result.getText(), "Image" ))
                .catch(e => navigate("/invalid", { state: { error: { message: "Failed to decode image", detail: e.message }}}));
        };
        fr.readAsDataURL(image);
    };

    async function handleDecodedData(data: string, method: "Image" | "Camera") {
        try {
            await verifyCredential(data, method);
            navigate("/home");
        } catch (e) {
            let message = e.message;
            let detail;
            if (e instanceof CredentialVerificationError) {
                detail = e.originalError?.message;
            }
            navigate("/invalid", { state: { error: { message, detail }}});
        }
    }
</script>

<style>
    main {
        height: 100%;
        overflow: hidden;
    }

	header {
        display: flex;
        flex-direction: column;
        height: 72px;
        background: linear-gradient(90deg, #00FFFF 0%, #0099FF 100%);
    }
	
	.options-wrapper > p {
		font-family: 'Proxima Nova', sans-serif;
		font-weight: 600;
		font-size: 14px;
		line-height: 16px;
		color: #F8F8F8;
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
		font-family: 'Proxima Nova', sans-serif;
		font-weight: 600;
		font-size: 14px;
		line-height: 16px;
		color: #F8F8F8;
        border: 1px solid #ccc;
        background-color: #00A7FF;;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
    }
</style>

<main transition:fly="{{ y: 200, duration: 500 }}">
    <header>
        <div class="options-wrapper">
            <img on:click="{() => navigate("/home")}" src="../assets/chevron-left.svg" alt="back" />
            <p>Scanner</p>
            <label class="image-select">
                <input type="file" accept="image/*" on:change={(e) => imageSelected(e)} />
                Browse
            </label>
        </div>
    </header>
    <Scanner on:message="{ev => handleDecodedData(ev.detail, "Camera")}" />
</main>
