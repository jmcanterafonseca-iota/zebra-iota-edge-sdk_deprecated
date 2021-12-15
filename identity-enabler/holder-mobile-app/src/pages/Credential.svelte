<script>
    import { fly } from "svelte/transition";
    import Button from "../components/Button.svelte";
    import ObjectList from "../components/ObjectList.svelte";
    import DevInfo from "./DevInfo.svelte";
    import { modalStatus } from "../lib/store";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { showAlert } from "../lib/ui/helpers";
    import { onMount } from "svelte";
    import { Plugins } from "@capacitor/core";

    const { App } = Plugins;
    let showTutorial = false;
    const credential = window.history.state.credential;
    const identityService = ServiceFactory.get("identity");
    const preparedCredentialDocument = identityService.prepareCredentialForDisplay(credential.credentialDocument);

    async function share() {
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to share a Credential");
            return;
        }

        modalStatus.set({
            active: true,
            type: "share",
            props: { credential }
        });
    }

    function goBack() {
        if ($modalStatus.active) {
            modalStatus.set({ active: false });
            return;
        }

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

<main transition:fly={{ x: 500, duration: 500 }}>
    {#if showTutorial}
        <DevInfo page="Credential" bind:showTutorial />
    {/if}

    {#if !showTutorial}
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
                {#if credential.enrichment.credentialLabel === "Organisation ID"}
                    <svg class="credential-logo" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M40.3938 29.301L43.7636 32.6828V38.8674H40.3938V29.301ZM38.4881 22.4936H30.2845V38.2804L33.6543 41.6622V46.4414L26.9108 39.6819V20.5292L18.19 11.8093C19.0786 11.0767 20.0414 10.4398 21.0625 9.9088L30.2806 19.1318H30.2845V8.00032C31.7202 7.98483 33.1058 8.52865 34.1501 9.51742C35.1944 10.5062 35.8159 11.8628 35.8839 13.302C35.952 14.7412 35.4612 16.1508 34.5148 17.2344C33.5685 18.3179 32.2403 18.9909 30.8097 19.1118H35.1184L35.1343 19.1278L38.4881 22.4936ZM33.6388 38.8438L33.6547 22.5139L37.0205 25.9156L37.0046 38.8438H33.6388ZM41.8464 25.9196L45.2122 29.2974H40.3903L37.0245 25.9196H41.8464ZM23.5495 21.955V36.5001L12 24.7139C12.0159 23.2605 12.2148 21.8472 12.5729 20.5056L20.1797 28.1395V23.3564L13.9097 17.064C14.4426 16.0431 15.0785 15.0798 15.8074 14.1893L23.5495 21.955ZM12.0597 34.3321V29.5529L33.6547 51.2209V56.0001L12.0597 34.3321ZM47.1298 34.5956H50.5035L54.8599 38.8677C54.8798 39.6115 54.751 40.3516 54.4811 41.0445C54.2112 41.7375 53.8057 42.3691 53.2886 42.9022C52.7714 43.4352 52.1531 43.8589 51.4701 44.1482C50.7871 44.4375 50.0533 44.5866 49.312 44.5866C48.5706 44.5866 47.8368 44.4375 47.1538 44.1482C46.4708 43.8589 45.8525 43.4352 45.3354 42.9022C44.8182 42.3691 44.4128 41.7375 44.1429 41.0445C43.873 40.3516 43.7442 39.6115 43.764 38.8677H47.1298V34.5956Z"
                            fill="white"
                        />
                    </svg>
                    <p>{credential.metaInformation.issuer.toUpperCase()}</p>
                {:else}
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
                            fill="#00A7FF"
                            stroke="white"
                            stroke-width="1.2"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                    <p>{credential.enrichment.issuerLabel}</p>
                {/if}
                <p>{credential.enrichment.credentialLabel}</p>
                <p>{new Date(preparedCredentialDocument.issuanceDate).toLocaleString()}</p>
            </header>
        </div>
        <section>
            <ObjectList object={preparedCredentialDocument.credentialSubject} />
        </section>
        <footer>
            <Button label="Share credential" onClick={share}>
                <svg class="share" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M13 4.41503V12.057C13 12.3223 12.8946 12.5766 12.7071 12.7641C12.5196 12.9517 12.2652 13.057 12 13.057C11.7348 13.057 11.4804 12.9517 11.2929 12.7641C11.1054 12.5766 11 12.3223 11 12.057V4.41503L9.879 5.53703C9.69123 5.72468 9.4366 5.83004 9.17115 5.82994C8.90569 5.82985 8.65114 5.72431 8.4635 5.53653C8.27586 5.34876 8.1705 5.09414 8.17059 4.82868C8.17068 4.56322 8.27623 4.30868 8.464 4.12103L11.293 1.29403C11.3857 1.20085 11.4958 1.1269 11.6171 1.07644C11.7385 1.02598 11.8686 1 12 1C12.1314 1 12.2615 1.02598 12.3829 1.07644C12.5042 1.1269 12.6143 1.20085 12.707 1.29403L15.536 4.12204C15.6289 4.21501 15.7026 4.32538 15.7529 4.44683C15.8031 4.56828 15.829 4.69845 15.8289 4.82989C15.8289 4.96133 15.8029 5.09148 15.7526 5.21289C15.7022 5.33431 15.6285 5.44462 15.5355 5.53753C15.4425 5.63045 15.3322 5.70413 15.2107 5.75439C15.0893 5.80465 14.9591 5.83049 14.8276 5.83044C14.6962 5.8304 14.5661 5.80446 14.4446 5.75412C14.3232 5.70378 14.2129 5.63001 14.12 5.53703L13 4.41503ZM7 9.00103C7.26522 9.00103 7.51957 9.10639 7.70711 9.29393C7.89464 9.48146 8 9.73582 8 10.001C8 10.2663 7.89464 10.5206 7.70711 10.7081C7.51957 10.8957 7.26522 11.001 7 11.001H5V17.001H19V11.001H17C16.7348 11.001 16.4804 10.8957 16.2929 10.7081C16.1054 10.5206 16 10.2663 16 10.001C16 9.73582 16.1054 9.48146 16.2929 9.29393C16.4804 9.10639 16.7348 9.00103 17 9.00103H19C19.5304 9.00103 20.0391 9.21175 20.4142 9.58682C20.7893 9.96189 21 10.4706 21 11.001V17.001C21 17.5315 20.7893 18.0402 20.4142 18.4152C20.0391 18.7903 19.5304 19.001 19 19.001H5C4.46957 19.001 3.96086 18.7903 3.58579 18.4152C3.21071 18.0402 3 17.5315 3 17.001V11.001C3 10.4706 3.21071 9.96189 3.58579 9.58682C3.96086 9.21175 4.46957 9.00103 5 9.00103H7Z"
                    />
                </svg>
            </Button>
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
        z-index: 1;
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

    .credential-logo {
        width: 15%;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 3.5vh 3.5vh 0 3.5vh;
    }

    .share {
        fill: white;
        width: 1.75em;
        margin-right: 0.6rem;
    }
</style>
