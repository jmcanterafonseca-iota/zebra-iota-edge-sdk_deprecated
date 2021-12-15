<script>
    import { onMount } from "svelte";
    import bwipjs from "bwip-js";
    import FullScreenLoader from "../components/FullScreenLoader.svelte";
    import Button from "../components/Button.svelte";
    import DevInfo from "./DevInfo.svelte";
    import PresentationJson from "./PresentationJSON.svelte";

    let loading = true;
    let showJSON = false;
    let showTutorial = false;

    const credential = window.history.state.credential;

    function createMatrix() {
        loading = true;
        try {
            // The return value is the canvas element
            bwipjs.toCanvas("presentation", {
                bcid: "datamatrix",
                text: JSON.stringify(credential),
                scale: 3,
                padding: 20,
                backgroundcolor: "ffffff"
            });
        } catch (e) {
            console.error(e);
        }
        loading = false;
    }

    const addDaysToDate = (date, days) => {
        let dateOptions = { year: "numeric", month: "long", day: "numeric" };
        let res = new Date(date);
        res.setDate(res.getDate() + days);
        return res.toLocaleDateString("en-US", dateOptions);
    };

    onMount(() => {
        createMatrix();
    });

    function goBack() {
        window.history.back();
    }

    function onClickDev() {
        showTutorial = true;
    }

    function onClickJSON() {
        showJSON = true;
    }
</script>

<main>
    {#if showTutorial}
        <DevInfo page="Presentation" bind:showTutorial />
    {:else if showJSON}
        <PresentationJson code={JSON.stringify(credential, null, 2)} bind:showJSON />
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
            <div class="header">
                <svg class="credential-logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M26.9232 14.0982V12.8374L16.6532 12.8365C16.5788 12.8365 16.5185 12.7745 16.5185 12.6981L16.4927 12.1282C16.4491 11.4566 15.9894 11 15.3669 11H11.127C10.5046 11 10 11.5046 10 12.127V27.5077"
                        stroke="white"
                        stroke-width="1.2"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M11.9049 27.3454C11.6834 28.0795 11.0701 28.9003 10.4414 28.9961L26.9385 29.0001C27.561 29.0001 27.8113 28.8353 28.0655 27.8732C28.3197 26.911 30.6951 15.9806 30.6951 15.9806C30.6951 15.7732 30.527 15.605 30.3195 15.605H14.8869C14.6794 15.605 14.5112 15.7732 14.5112 15.9806C14.5112 15.9806 12.1265 26.6114 11.9049 27.3454Z"
                        stroke="white"
                        stroke-width="1.2"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
                <header>
                    <span>Device {credential?.verifiableCredential?.credentialSubject?.DeviceData["Device Name"]}</span>
                    <p>{credential?.metaInformation?.issuer ?? "No issuer information"}</p>
                </header>
            </div>
        {/if}
        <div class="presentation-wrapper">
            <canvas id="presentation" />
        </div>
        {#if !loading}
            <footer class="footerContainer">
                <p>Valid until {addDaysToDate(credential?.verifiableCredential?.issuanceDate, 30)}</p>
                <Button
                    style="background: transparent; color: white; font-weight: 500; border: none;"
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

    .mini {
        width: 0px;
        height: 0px;
    }

    header > p {
        margin: 2vh 0;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 5vw;
        line-height: 5vw;
        color: #fff;
        padding: 0;
    }

    header > span {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 1.7vh;
        line-height: 2.3vh;
        color: #fff;
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

    .wrapper {
        text-align: center;
    }

    .credential-logo {
        width: 5em;
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
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }

    footer > p {
        color: #fff;
        padding: 2vh 0 1vh 0;
        margin: 0;
        font-family: "Proxima Nova", sans-serif;
        font-weight: 500;
        font-size: 2.9vh;
        line-height: 3.5vh;
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
