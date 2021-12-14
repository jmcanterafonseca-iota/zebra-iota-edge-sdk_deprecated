<script>
    import { Plugins } from '@capacitor/core';
    import { navigate } from "svelte-routing";

    import Button from '../components/Button.svelte';
    import TextField from '../components/TextField.svelte';
    import Header from '../components/Header.svelte';
	import FullScreenLoader from '../components/FullScreenLoader.svelte';

    import { ServiceFactory } from '../factories/serviceFactory';
	import { account, error, hasSetupAccount } from '../lib/store';
    import { showAlert } from '../lib/ui/helpers';
    
    const { Keyboard } = Plugins;

    let name = '';
	let loading = false;

    let background;

    function handleOuterClick() {
        if (event.target === background) {
            event.preventDefault();

            if (document.activeElement) {
                document.activeElement.blur();
            }
        }
    }

    async function save() {
        if (navigator.onLine === false) {
            showAlert('Error', 'You need Internet connectivity to generate a new IOTA Device Identity');
            return;
        } 

        if (loading) {
            return;
        }

        Keyboard.hide();

        error.set(null);

        account.set({ name: name });

        loading = true;

        try {
            const identityService = ServiceFactory.get('identity');
            const identity = await identityService.createIdentity();
            await identityService.storeIdentity('did', identity);
            console.log('Identity', identity)
            loading = false;
            hasSetupAccount.set(true);

            navigate('home');
        } catch (err) {
            error.set('Error creating identity. Please try again.');
            loading = false;
        }
    }
</script>

<style>
    main {
        height: 100%;
        background-color: #F8F8F8;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        width: 100%;
    }

    .headerContainer {
        display: flex;
    }

    .contentContainer {
        display: flex;
    }

    .contentContainer {
        text-align: center;
        align-items: center;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .contentContainer > img {
        mix-blend-mode: multiply;
        max-height: 150px;
    }

    footer {
        width: 100%;
    }
</style>

<main
    bind:this="{background}"
    on:click="{handleOuterClick}"
>
    {#if loading}
        <FullScreenLoader label="Creating Identity..." />
    {:else}
        <div class="headerContainer">
            <Header text="Set the name of the device" />
        </div>

        <div class="contentContainer">
            <img src="../assets/landing-2.png" alt="set-name" />
            <TextField bind:value="{name}" placeholder="Device name" />
        </div>

        <footer>
            <Button
                style="background: #00A7FF; color: white; height: 64px;" 
                loadingText="{'Generating identity'}"
                disabled="{name.length === 0}"
                label="Next"
                onClick="{save}"
            />
        </footer>
    {/if}
</main>
