<script>
    import { navigate } from "svelte-routing";
    import { updateStorage, error } from "../lib/store";
    import { SchemaNames } from "../schemas";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { generateRandomId } from "../lib/helpers";
    import { showAlert } from "../lib/ui/helpers";
    import FullScreenLoader from "../components/FullScreenLoader.svelte";
    import Button from "../components/Button.svelte";
    import ObjectList from "../components/ObjectList.svelte";
    import DevInfo from "./DevInfo.svelte";
    import { onMount } from "svelte";
    import { Plugins } from "@capacitor/core";

    const { App } = Plugins;
    let showTutorial = false;
    let loading = false;

    const claims = window.history.state.claims;

    async function createCredential() {
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to create a Device Credential");
            return;
        }

        loading = true;
        const identityService = ServiceFactory.get("identity");
        error.set(null);
        try {
            const storedIdentity = await identityService.retrieveIdentity();
            const payload = {
                DeviceData: {
                    "Device ID": claims.id,
                    "Device Name": claims.deviceName,
                    Manufacturer: claims.manufacturer,
                    "Serial Number": claims.uuid,
                    "Operating System": claims.operatingSystem,
                    Model: claims.model,
                    "OS Version": claims.osVersion
                }
            };
            const newCredential = await identityService.createSelfSignedCredential(
                storedIdentity,
                SchemaNames.Organisation_ID,
                payload
            );
            const credentialId = generateRandomId();
            const enrichment = identityService.enrichCredential({ ...newCredential });
            const credential = {
                credentialDocument: { ...newCredential },
                metaInformation: { issuer: "Zebra Technologies" },
                id: credentialId,
                enrichment
            };
            console.log("new credential", credential);
            await updateStorage("credentials", { ["organization"]: credential });
            loading = false;
            navigate("/createPresentation", { state: { credential } });
        } catch (err) {
            error.set("Error creating credential. Please try again.");
            loading = false;
        }
    }

    function goBack() {
        if (showTutorial) {
            showTutorial = false;
            return;
        }

        window.history.back();
    }

    function onClickDev() {
        showTutorial = true;
    }

    onMount(() => App.addListener("backButton", goBack).remove);
</script>

<main>
    {#if loading}
        <FullScreenLoader label="Loading Credential..." />
    {/if}

    {#if !loading && showTutorial}
        <DevInfo page="Credential" bind:showTutorial />
    {/if}

    {#if !loading && !showTutorial}
        <div class="header-wrapper">
            <div class="options-wrapper">
                <svg
                    on:click={goBack}
                    class="options-icon arrow"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M15 6L9 12L15 18" />
                </svg>
                <svg on:click={onClickDev} class="options-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.7362 4.06395C15.2551 4.26336 15.5227 4.86915 15.3338 5.41702L10.5456 19.3051C10.3567 19.853 9.78282 20.1355 9.26384 19.936C8.74486 19.7366 8.47727 19.1309 8.66617 18.583L13.4544 4.6949C13.6433 4.14703 14.2172 3.86454 14.7362 4.06395ZM4.41421 12.2561L7.94975 15.9885C8.34027 16.4008 8.34027 17.0692 7.94975 17.4815C7.55922 17.8937 6.92606 17.8937 6.53553 17.4815L2.29289 13.0026C1.90237 12.5904 1.90237 11.9219 2.29289 11.5097L6.53553 7.03085C6.92606 6.61858 7.55922 6.61858 7.94975 7.03085C8.34027 7.44311 8.34027 8.11152 7.94975 8.52379L4.41421 12.2561ZM19.5858 12.2561L16.0503 8.52379C15.6597 8.11152 15.6597 7.44311 16.0503 7.03085C16.4408 6.61858 17.0739 6.61858 17.4645 7.03085L21.7071 11.5097C22.0976 11.9219 22.0976 12.5904 21.7071 13.0026L17.4645 17.4815C17.0739 17.8937 16.4408 17.8937 16.0503 17.4815C15.6597 17.0692 15.6597 16.4008 16.0503 15.9885L19.5858 12.2561Z"
                    />
                </svg>
            </div>
            <header>
                <p>Device {claims.deviceName} claims</p>
            </header>
        </div>
        <section>
            <ObjectList object={claims} />
        </section>
        <footer>
            <Button                label="Issue Device ID credential"                onClick={createCredential}            />
        </footer>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        position: relative;
        height: 100%;
    }

    header {
        margin-bottom: 5vh;
    }

    .header-wrapper {
        text-align: center;
        padding-bottom: 3vh;
        background-color: #00a7ff;
    }

    .options-icon {
        fill: white;
        width: 1.75em;
    }

    .arrow {
        fill: none !important;
        stroke: white;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    header {
        margin-left: auto;
        margin-right: auto;
        height: fit-content;
        margin-bottom: 0;
    }

    header > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 3.4vh;
        line-height: 3.4vh;
        color: #fff;
    }

    header > p:nth-child(2) {
        font-weight: 600;
        text-transform: uppercase;
        font-size: 1.7vh;
        line-height: 2.3vh;
    }

    header > p:nth-child(3) {
        margin: 1.6vh 0 0 0;
    }

    header > p:nth-child(4) {
        margin-bottom: 0;
        font-size: 1.7vh;
    }

    section {
        margin: 0 7vw;
        z-index: 0;
    }

    footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index: 1;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 3.5vh 3.5vh 0 3.5vh;
    }
</style>
