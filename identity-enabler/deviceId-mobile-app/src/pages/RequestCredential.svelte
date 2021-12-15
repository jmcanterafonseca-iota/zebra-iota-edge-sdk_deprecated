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
            <div class="options-wrapper">
                <img src="../assets/chevron-left.svg" on:click={goBack} alt="back" />
                <p>Request Device DID credential</p>
                <img class="code" src="../assets/code.svg" on:click={onClickDev} alt="code" />
            </div>
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
        display: flex;
        flex-direction: column;
        height: 72px;
        background-color: #aee693;
    }

    .options-wrapper > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 2.3vh;
        line-height: 2.7vh;
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

    img {
        margin: 0 !important;
    }

    .code {
        margin-left: auto;
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
        padding: 1rem;
    }

    .scan-icon {
        width: 1.75em;
    }
</style>
