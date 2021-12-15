<script>
    import { Plugins } from "@capacitor/core";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { fly } from "svelte/transition";
    import Button from "../components/Button.svelte";
    import DevInfo from "./DevInfo.svelte";
    import { showAlert } from "../lib/ui/helpers";

    const { App } = Plugins;
    let showTutorial = false;

    onMount(() => App.addListener("backButton", goBack).remove);
    async function scan() {
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to verify a Device Credential");
            return;
        }
        navigate("scan");
    }

    function onClickDev() {
        showTutorial = true;
    }

    function goBack() {
        if (showTutorial) {
            showTutorial = false;
            return;
        }

        window.history.back();
    }
</script>

<main transition:fly={{ x: 500, duration: 500 }}>
    {#if showTutorial}
        <DevInfo page="Presentation" bind:showTutorial />
    {/if}

    {#if !showTutorial}
        <header>
            <svg on:click={goBack} class="options-icon arrow" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 6L9 12L15 18" />
            </svg>
            <p>Request Device DID credential</p>
            <svg on:click={onClickDev} class="options-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M14.7362 4.06395C15.2551 4.26336 15.5227 4.86915 15.3338 5.41702L10.5456 19.3051C10.3567 19.853 9.78282 20.1355 9.26384 19.936C8.74486 19.7366 8.47727 19.1309 8.66617 18.583L13.4544 4.6949C13.6433 4.14703 14.2172 3.86454 14.7362 4.06395ZM4.41421 12.2561L7.94975 15.9885C8.34027 16.4008 8.34027 17.0692 7.94975 17.4815C7.55922 17.8937 6.92606 17.8937 6.53553 17.4815L2.29289 13.0026C1.90237 12.5904 1.90237 11.9219 2.29289 11.5097L6.53553 7.03085C6.92606 6.61858 7.55922 6.61858 7.94975 7.03085C8.34027 7.44311 8.34027 8.11152 7.94975 8.52379L4.41421 12.2561ZM19.5858 12.2561L16.0503 8.52379C15.6597 8.11152 15.6597 7.44311 16.0503 7.03085C16.4408 6.61858 17.0739 6.61858 17.4645 7.03085L21.7071 11.5097C22.0976 11.9219 22.0976 12.5904 21.7071 13.0026L17.4645 17.4815C17.0739 17.8937 16.4408 17.8937 16.0503 17.4815C15.6597 17.0692 15.6597 16.4008 16.0503 15.9885L19.5858 12.2561Z"
                />
            </svg>
        </header>

        <section>
            <p class="subheader">Add Device DID credential</p>
            <p class="description">Scan the Device Credential DataMatrix code generated in the Holder app</p>
        </section>

        <footer>
            <Button style="height: 64px; width: 64px; border-radius: 50%;" onClick={scan}>
                <svg class="scan-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M16 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V16C20 15.7348 20.1054 15.4804 20.2929 15.2929C20.4804 15.1054 20.7348 15 21 15C21.2652 15 21.5196 15.1054 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16V18C22 19.0609 21.5786 20.0783 20.8284 20.8284C20.0783 21.5786 19.0609 22 18 22H6C4.93913 22 3.92172 21.5786 3.17157 20.8284C2.42143 20.0783 2 19.0609 2 18V16C2 15.7348 2.10536 15.4804 2.29289 15.2929C2.48043 15.1054 2.73478 15 3 15C3.26522 15 3.51957 15.1054 3.70711 15.2929C3.89464 15.4804 4 15.7348 4 16V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H8C8.26522 20 8.51957 20.1054 8.70711 20.2929C8.89464 20.4804 9 20.7348 9 21C9 21.2652 8.89464 21.5196 8.70711 21.7071C8.51957 21.8946 8.26522 22 8 22H16C15.7348 22 15.4804 21.8946 15.2929 21.7071C15.1054 21.5196 15 21.2652 15 21C15 20.7348 15.1054 20.4804 15.2929 20.2929C15.4804 20.1054 15.7348 20 16 20ZM4 8C4 8.26522 3.89464 8.51957 3.70711 8.70711C3.51957 8.89464 3.26522 9 3 9C2.73478 9 2.48043 8.89464 2.29289 8.70711C2.10536 8.51957 2 8.26522 2 8V6C2 4.93913 2.42143 3.92172 3.17157 3.17157C3.92172 2.42143 4.93913 2 6 2H8C8.26522 2 8.51957 2.10536 8.70711 2.29289C8.89464 2.48043 9 2.73478 9 3C9 3.26522 8.89464 3.51957 8.70711 3.70711C8.51957 3.89464 8.26522 4 8 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V8ZM20 8V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H16C15.7348 4 15.4804 3.89464 15.2929 3.70711C15.1054 3.51957 15 3.26522 15 3C15 2.73478 15.1054 2.48043 15.2929 2.29289C15.4804 2.10536 15.7348 2 16 2H18C19.0609 2 20.0783 2.42143 20.8284 3.17157C21.5786 3.92172 22 4.93913 22 6V8C22 8.26522 21.8946 8.51957 21.7071 8.70711C21.5196 8.89464 21.2652 9 21 9C20.7348 9 20.4804 8.89464 20.2929 8.70711C20.1054 8.51957 20 8.26522 20 8Z"
                    />
                </svg>
            </Button>
        </footer>
    {/if}
</main>

<style>
    main {
        height: 100%;
        flex-direction: column;
        display: flex;
        justify-content: space-between;
    }

    section {
        padding: 0 2rem;
        text-align: center;
    }

    header {
        background-color: #aee693;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 72px;
        padding: 0 2.6vh;
    }

    .options-icon {
        fill: black;
        width: 1.75em;
    }

    .arrow {
        fill: none !important;
        stroke: black;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    header > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 1.2em;
        margin: 0;
        z-index: 1;
    }

    p.subheader {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 1.6em;
        margin-bottom: 1.75vh;
    }

    p.description {
        font-family: "Proxima Nova", sans-serif;
        font-size: 0.9em;
        color: #6f7a8d;
    }

    footer {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1.5rem;
    }

    .scan-icon {
        width: 1.75em;
    }
</style>
