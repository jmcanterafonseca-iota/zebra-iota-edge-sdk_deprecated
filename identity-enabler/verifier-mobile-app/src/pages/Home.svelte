<script lang="ts">
    import { Plugins } from "@capacitor/core";
    import { onMount } from "svelte";
    import router from "page";
    import { slide } from "svelte/transition";
    import { getFromStorage, Button, ListItem, FullScreenLoader, isExpired } from "@zebra-iota-edge-sdk/common/dist";
    import DevInfo from "./DevInfo.svelte";
    import Credential from "./Credential.svelte";

    const { App, Modals } = Plugins;

    let isEmpty = false;
    let expired = false;
    let showTutorial = false;
    let showCredential = false;
    let localCredentials = [];
    let credentialItem = {};
    let loading = false;

    onMount(async () => {
        App.addListener("backButton", function () {});
        setTimeout(async () => {
            try {
                loading = true;
                localCredentials = getFromStorage("credentials");
                localCredentials = Object.values(localCredentials)?.filter(data => data) ?? [];
                console.log("onMount", localCredentials);
                isEmpty = Object.values(localCredentials).every(x => x === null || x === "");
                loading = false;
            } catch (err) {
                console.log(err);
                loading = false;
            }
        }, 0);
    });

    function scan() {
        router.show("/scan");
    }

    function onClickDev() {
        showTutorial = true;
    }

    function onClickCredential(credential) {
        expired = isExpired(credential.issuanceDate);
        credentialItem = credential;
        showCredential = true;
    }

    async function onClickReset() {
        let confirmRet = await Modals.confirm({
            title: "Reset the app",
            message: "Are you sure you want to reset the app and delete all credentials?"
        });
        if (confirmRet.value) {
            localStorage.setItem(
                "credentials",
                JSON.stringify({
                    personal: "",
                    health: "",
                    blood: ""
                })
            );
            localCredentials = [];
            isEmpty = true;
        }
    }
</script>

<main>
    {#if loading}
        <FullScreenLoader label="loading Credentials..." />
    {/if}

    {#if showTutorial}
        <DevInfo page="Presentation" bind:showTutorial />
    {/if}

    {#if showCredential}
        <Credential {expired} localCredential={credentialItem} bind:showCredential bind:localCredentials bind:isEmpty />
    {/if}

    {#if !showCredential && !showTutorial && !loading}
        <header>
            <div class="options-wrapper">
                <img src="../assets/reset.svg" on:click={onClickReset} alt="reset" />
                <p>SCANNED CREDENTIALS</p>
                <img class="code" src="../assets/code.svg" on:click={onClickDev} alt="code" />
            </div>
        </header>
        <section>
            {#if isEmpty}
                <div class="empty-wrapper">
                    <p>No credentials scanned</p>
                </div>
            {:else}
                {#each Object.values(localCredentials) as credential}
                    <div transition:slide class="list">
                        <ListItem
                            onClick={() => onClickCredential(credential)}
                            heading={"IOTA"}
                            subheading={credential.type[1]}
                            icon={isExpired(credential.issuanceDate) ? "expire-small.svg" : "tick.svg"}
                        />
                    </div>
                {/each}
            {/if}
        </section>
        <footer>
            <Button
                style="background: #00A7FF; color: white; height: 64px; width: 64px; border-radius: 50%;"
                onClick={scan}
            >
                <img src="../assets/scan.png" alt="scan" />
            </Button>
        </footer>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        z-index: 1;
    }

    header {
        display: flex;
        flex-direction: column;
        height: 72px;
        background: linear-gradient(90deg, #00ffff 0%, #0099ff 100%);
    }

    section {
        flex: 1;
        align-content: space-between;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        background: #f8f8f8;
    }

    .list {
        padding: 0 20px;
    }

    .list:first-child {
        margin-top: 3.5vh;
    }

    .list:not(:last-child) {
        margin-bottom: 3vh;
    }

    .list:last-child {
        margin-bottom: 9vh;
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

    img {
        margin: 0 !important;
    }

    .code {
        margin-left: auto;
    }

    .empty-wrapper {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .empty-wrapper > p {
        font-family: "Proxima Nova", sans-serif;
        font-size: 14px;
        color: #767676;
    }

    footer {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        bottom: 0;
        padding-bottom: 4.1vh;
        z-index: 1;
        background: #f8f8f8;
    }
</style>
