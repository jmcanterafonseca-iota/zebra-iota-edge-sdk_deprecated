<script lang="ts">
    import { navigate } from 'svelte-routing';
    import { fly } from 'svelte/transition';
    import { Plugins } from '@capacitor/core';
    import { ServiceFactory } from '../factories/serviceFactory';
    import { error, loadingScreen, updateStorage } from '../lib/store';
    import { parse } from '../lib/helpers';
    import { __ANDROID__ } from '../lib/platforms';
    import Scanner from '../components/Scanner.svelte';
    import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from '@zxing/library';
    import type { IdentityService } from '../services/identityService';

    const { Toast } = Plugins;
    const formats = new Map().set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.DATA_MATRIX, BarcodeFormat.QR_CODE]);
    const reader = new BrowserMultiFormatReader(formats);
    let VP;

    async function handleScannerData(event) {
        try {
            loadingScreen.set("Verifying credential...");
            let parsedData = parse(event.detail);
            VP = parsedData;

            if (!VP) {
                loadingScreen.set();
                navigate('/invalid');
                return;
            }

            const identityService = ServiceFactory.get<IdentityService>('identity');
            const verificationResult = await identityService.verifyVerifiablePresentation(VP);
    
            if (verificationResult) {
                await updateStorage('credentials', { [VP.verifiableCredential.type[1].split(/\b/)[0].toLowerCase()]: VP.verifiableCredential });
                loadingScreen.set();
                showToast();
                navigate('/home');
            } else {
                loadingScreen.set();
                navigate('/invalid');
                error.set('Invalid Data Matrix');
            }
        } catch (err) {
            console.error(err);
        };
    }

    // handles input button
    const imageSelected = (e) => {
        const image = e.currentTarget.files[0];
        
        const fr = new FileReader();
        fr.onload = (e: ProgressEvent<FileReader>) => {
            loadingScreen.set("Decoding image...");
            reader.decodeFromImageUrl(e.target.result as string)
                .then(result => handleScannerData({ detail: result.getText() }))
                .catch(e => {
                    console.error(e);
                    loadingScreen.set();
                    navigate('/invalid');
                });
        };
        fr.readAsDataURL(image);
    };

    async function showToast() {
        await Toast.show({
            text: 'Credential verified!',
            position: 'center'
        });
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
            <img on:click="{() => navigate('/home')}" src="../assets/chevron-left.svg" alt="back" />
            <p>Scanner</p>
            <label class="image-select">
                <input type="file" accept="image/*" on:change={(e) => imageSelected(e)} />
                Browse
            </label>
        </div>
    </header>
    <Scanner on:message="{handleScannerData}" />
</main>