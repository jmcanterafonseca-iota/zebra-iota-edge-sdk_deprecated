<script lang="ts">
    import { Plugins } from "@capacitor/core";
    import { flip } from "svelte/animate";
    import router from "page";
    import {
        Header,
        TextField,
        FullScreenLoader,
        Button,
        ServiceFactory,
        account,
        error,
        hasSetupAccount,
        IdentityService,
        __WEB__
    } from "@zebra-iota-edge-sdk/common/dist";

    const { Keyboard } = Plugins;

    let name = "";
    let isKeyboardActive = false;
    let loading = false;

    let background;
    let keyboardHeight;

    if (!__WEB__) {
        Keyboard.addListener("keyboardWillShow", info => {
            keyboardHeight = info.keyboardHeight;
            isKeyboardActive = true;
        });

        Keyboard.addListener("keyboardWillHide", () => {
            isKeyboardActive = false;
        });
    }

    function handleOuterClick(event: MouseEvent) {
        if (event.target === background) {
            event.preventDefault();

            if (document.activeElement) {
                // document.activeElement.blur();
            }
        }
    }

    async function save() {
        if (loading) {
            return;
        }

        if (!__WEB__) {
            Keyboard.hide();
        }

        error.set(null);

        account.set({ name: name });

        loading = true;

        try {
            const identityService = ServiceFactory.get<IdentityService>("identity");
            const identity = await identityService.createIdentity();
            await identityService.storeIdentity("did", identity);
            console.log("Identity", identity);
            loading = false;
            hasSetupAccount.set(true);

            router.show("/home");
        } catch (err) {
            error.set("Error creating identity. Please try again.");
            loading = false;
        }
    }
</script>

{#each [true] as item, index (item)}
    <div class="name-container" bind:this={background} on:click={handleOuterClick} animate:flip={{ duration: 350 }}>
        {#if loading}
            <FullScreenLoader label="Creating Identity..." />
        {:else}
            <Header text="Set your name" />

            <div class="content"><img src="../assets/set-name.png" alt="set-name" /></div>

            <TextField bind:value={name} placeholder="Your Name" />

            <footer>
                <Button
                    style="background: #00A7FF; color: white; height: 64px;"
                    loadingText={"Generating identity"}
                    disabled={name.length === 0}
                    label="Next"
                    onClick={save}
                />
            </footer>
        {/if}
    </div>
{/each}

<style>
    .name-container {
        height: 100%;
        background-color: #f8f8f8;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        position: absolute;
        width: 100%;
    }

    .content {
        text-align: center;
        z-index: 1;
    }

    .content > img {
        mix-blend-mode: multiply;
    }

    footer {
        padding: 0px 7vw;
        width: 100vh;
    }

    img {
        width: 27vh;
        height: 27vh;
        margin-top: 12.5vh;
    }
</style>
