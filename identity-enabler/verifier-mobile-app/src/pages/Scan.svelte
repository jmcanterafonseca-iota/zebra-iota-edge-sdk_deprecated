<script lang="ts">
    import { navigate } from "svelte-routing";
    import { fly } from "svelte/transition";
    import { Plugins } from "@capacitor/core";
    import { ServiceFactory, error, updateStorage, __ANDROID__, parse, IdentityService } from "@zebra-iota-edge-sdk/common";
    import Scanner from "../components/Scanner.svelte";
    import InvalidCredential from "../components/InvalidCredential.svelte";
    import FullScreenLoader from "../components/FullScreenLoader.svelte";

    const { Toast } = Plugins;

    let VP;
    let invalid = false;
    let loading = false;

    async function handleScannerData(event) {
        try {
            loading = true;
            let parsedData = parse(event.detail);
            VP = parsedData;
            console.log("VP", VP);

            if (!VP) return showAlert();

            const identityService = ServiceFactory.get<IdentityService>("identity");
            const verificationResult = await identityService.verifyVerifiablePresentation(VP as any);

            if (verificationResult) {
                updateStorage("credentials", {
                    [VP.verifiableCredential.type[1].split(/\b/)[0].toLowerCase()]: VP.verifiableCredential
                });
                showToast();
                loading = false;
                goBack();
            } else {
                loading = false;
                showAlert();
                error.set("Invalid Data Matrix");
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function showToast() {
        await Toast.show({
            text: "Credential verified!",
            position: "center"
        });
    }

    function showAlert() {
        invalid = true;
        loading = false;
    }

    function goBack() {
        navigate("home");
    }
</script>

<main transition:fly={{ y: 200, duration: 500 }}>
    {#if loading}
        <FullScreenLoader label="Verifying Credential..." />
    {/if}

    {#if invalid && !loading}
        <InvalidCredential />
    {/if}

    {#if !invalid && !loading}
        <header class:ios={__ANDROID__}>
            <img on:click={goBack} src="../assets/chevron-left.svg" alt="back" />
            <p>Scanner</p>
        </header>
        <Scanner on:message={handleScannerData} />
    {/if}
</main>

<style>
    main {
        height: 100%;
        overflow: hidden;
    }

    header {
        background: linear-gradient(90deg, #00ffff 0%, #0099ff 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        height: 7.4vh;
    }

    header.ios {
        padding: calc(env(safe-area-inset-top) + 1vh) 0 2vw 0;
        padding: calc(constant(safe-area-inset-top) + 1vh) 0 2vw 0;
    }

    img {
        position: absolute;
        left: 5vw;
    }

    header > p {
        flex-grow: 1;
        overflow: hidden;
        text-align: center;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 5vw;
        line-height: 5vw;
        letter-spacing: 0.04em;
        color: #ffffff;
        margin: 0;
    }
</style>
