<script>
    import { onMount } from "svelte";
    import bwipjs from "bwip-js";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { error } from "../lib/store";
    import FullScreenLoader from "../components/FullScreenLoader.svelte";
    import Button from "../components/Button.svelte";
    import DevInfo from "./DevInfo.svelte";
    import PresentationJson from "./PresentationJSON.svelte";
    import { Plugins } from "@capacitor/core";

    const { App } = Plugins;
    let presentationJSON = "";
    let loading = true;
    let showJSON = false;
    let showTutorial = false;

    const credential = window.history.state.credential;
    const identityService = ServiceFactory.get("identity");
    const preparedCredentialDocument = identityService.prepareCredentialForDisplay(credential.credentialDocument);

    function createMatrix(content) {
        try {
            // The return value is the canvas element
            bwipjs.toCanvas("presentation", {
                bcid: "datamatrix",
                text: content,
                scale: 3,
                padding: 20,
                backgroundcolor: "ffffff"
            });
        } catch (e) {
            console.error(e);
        }
    }

    const addDaysToDate = (date, days) => {
        let dateOptions = { year: "numeric", month: "long", day: "numeric" };
        let res = new Date(date);
        res.setDate(res.getDate() + days);
        return res.toLocaleDateString("en-US", dateOptions);
    };

    onMount(() => {
        setTimeout(async () => {
            error.set(null);
            try {
                const storedIdentity = await identityService.retrieveIdentity();
                console.log(storedIdentity, credential);
                const verifiablePresentation = await identityService.createVerifiablePresentation(
                    storedIdentity,
                    credential?.credentialDocument
                );
                console.log("verifiablePresentation", verifiablePresentation);
                presentationJSON = JSON.stringify(verifiablePresentation, null, 2);
                createMatrix(JSON.stringify(verifiablePresentation));
                loading = false;
            } catch (err) {
                error.set("Error creating identity. Please try again.");
                loading = false;
            }
        }, 500);
    });

    function goBack() {
        if (showTutorial) {
            showTutorial = false;
            return;
        }

        if (showJSON) {
            showJSON = false;
            return;
        }

        window.history.back();
    }

    function onClickDev() {
        showTutorial = true;
    }

    function onClickJSON() {
        showJSON = true;
    }

    onMount(() => App.addListener("backButton", goBack).remove);
</script>

<main>
    {#if showTutorial}
        <DevInfo page="Presentation" bind:showTutorial />
    {:else if showJSON}
        <PresentationJson code={presentationJSON} bind:showJSON />
    {/if}

    {#if loading}
        <FullScreenLoader label="Creating Data Matrix..." />
    {/if}
    <div class={loading ? "wrapper mini" : "wrapper"}>
        {#if !loading}
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
                {#if credential.enrichment.credentialLabel === "Organisation ID"}
                    <svg class="credential-logo" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M40.3938 29.301L43.7636 32.6828V38.8674H40.3938V29.301ZM38.4881 22.4936H30.2845V38.2804L33.6543 41.6622V46.4414L26.9108 39.6819V20.5292L18.19 11.8093C19.0786 11.0767 20.0414 10.4398 21.0625 9.9088L30.2806 19.1318H30.2845V8.00032C31.7202 7.98483 33.1058 8.52865 34.1501 9.51742C35.1944 10.5062 35.8159 11.8628 35.8839 13.302C35.952 14.7412 35.4612 16.1508 34.5148 17.2344C33.5685 18.3179 32.2403 18.9909 30.8097 19.1118H35.1184L35.1343 19.1278L38.4881 22.4936ZM33.6388 38.8438L33.6547 22.5139L37.0205 25.9156L37.0046 38.8438H33.6388ZM41.8464 25.9196L45.2122 29.2974H40.3903L37.0245 25.9196H41.8464ZM23.5495 21.955V36.5001L12 24.7139C12.0159 23.2605 12.2148 21.8472 12.5729 20.5056L20.1797 28.1395V23.3564L13.9097 17.064C14.4426 16.0431 15.0785 15.0798 15.8074 14.1893L23.5495 21.955ZM12.0597 34.3321V29.5529L33.6547 51.2209V56.0001L12.0597 34.3321ZM47.1298 34.5956H50.5035L54.8599 38.8677C54.8798 39.6115 54.751 40.3516 54.4811 41.0445C54.2112 41.7375 53.8057 42.3691 53.2886 42.9022C52.7714 43.4352 52.1531 43.8589 51.4701 44.1482C50.7871 44.4375 50.0533 44.5866 49.312 44.5866C48.5706 44.5866 47.8368 44.4375 47.1538 44.1482C46.4708 43.8589 45.8525 43.4352 45.3354 42.9022C44.8182 42.3691 44.4128 41.7375 44.1429 41.0445C43.873 40.3516 43.7442 39.6115 43.764 38.8677H47.1298V34.5956Z" fill="white"/>
                    </svg>
                    <span>{credential.metaInformation.issuer.toUpperCase()}</span>
                {:else}
                    <svg class="credential-logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.9232 14.0982V12.8374L16.6532 12.8365C16.5788 12.8365 16.5185 12.7745 16.5185 12.6981L16.4927 12.1282C16.4491 11.4566 15.9894 11 15.3669 11H11.127C10.5046 11 10 11.5046 10 12.127V27.5077" stroke="white" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M11.9049 27.3454C11.6834 28.0795 11.0701 28.9003 10.4414 28.9961L26.9385 29.0001C27.561 29.0001 27.8113 28.8353 28.0655 27.8732C28.3197 26.911 30.6951 15.9806 30.6951 15.9806C30.6951 15.7732 30.527 15.605 30.3195 15.605H14.8869C14.6794 15.605 14.5112 15.7732 14.5112 15.9806C14.5112 15.9806 12.1265 26.6114 11.9049 27.3454Z" fill="#00A7FF" stroke="white" stroke-width="1.2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>{credential.enrichment.issuerLabel.toUpperCase()}</span>
                {/if}
                <p>{credential.enrichment.credentialLabel}</p>
            </header>
        {/if}
        <div class="presentation-wrapper">
            <canvas id="presentation" />
        </div>
        {#if !loading}
            <footer class="footerContainer">
                {#if credential.enrichment.credentialLabel === "Organisation ID"}
                    <span>Scan this Barcode with the Device ID app</span>
                    <p>Valid until {addDaysToDate(preparedCredentialDocument.issuanceDate, 30)}</p>
                {:else}
                    <p>Valid until {addDaysToDate(preparedCredentialDocument.issuanceDate, 30)}</p>
                {/if}
                <Button
                    style="background: transparent; color: white; font-weight: 500; font-size: 1.7vh; line-height: 2.3vh; border: none; height:fit-content;"
                    label="VIEW IN JSON FORMAT"
                    onClick={onClickJSON}
                />
            </footer>
        {/if}
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        position: relative;
        height: 100%;
        background: black;
    }

    canvas {
        position: relative;
        width: 100%;
        z-index: 5;
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

    .mini {
        width: 0px;
        height: 0px;
    }

    header {
        z-index: 1;
        height: fit-content;
        margin-bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    header > p {
        margin: 1.5vh 0 6.2vh 0;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 2.4vh;
        line-height: 2.4vh;
        color: #fff;
        padding: 0;
    }

    header > span {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 1.4vh;
        line-height: 1.8vh;
        color: #fff;
    }

    .wrapper {
        text-align: center;
    }

    .credential-logo {
        width: 10%;
        margin-bottom: 1.5vh;
    }

    .presentation-wrapper {
        height: fit-content;
        position: relative;
        background: white;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        bottom: 1.5vh;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }

    footer > p {
        color: #fff;
        padding: 4.6vh 0 1vh 0;
        margin: 0;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 500;
        font-size: 2.9vh;
        line-height: 3.5vh;
    }

    footer > span {
        color: #fff;
        margin-top: 5.4vh;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 500;
        font-size: 1.7vh;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 3.5vh 3.5vh 0 3.5vh;
        position: relative;
        z-index: 2;
    }

    .footerContainer {
        position: fixed;
        text-align: center;
        width: 100%;
    }
</style>
