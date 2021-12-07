<script lang="ts">
    import { fly } from 'svelte/transition';
    import { Plugins } from '@capacitor/core';
    import Button from '../components/Button.svelte';
    import ObjectList from '../components/ObjectList.svelte';
    import type { IScan } from '../models/types/IScan';
    import { isExpired } from '../lib/helpers';
	import { ServiceFactory } from "../factories/serviceFactory";
	import type { ScanSvelteStore } from "../lib/stores/ScanStore";
    import { navigate } from 'svelte-routing';

    const { Modals } = Plugins;
    const scans = ServiceFactory.get<ScanSvelteStore>("scans");
    const scan = history.state.scan as IScan;
    const expired = isExpired(scan.vp.verifiableCredential.issuanceDate);

    async function onDelete() {
		let confirmRet = await Modals.confirm({
			title: 'Delete credential',
			message: 'Are you sure you want to delete the credential?'
		});
		if (confirmRet.value) {
            scans.delete(scan.id);
            back();
		}
	}

    function onClickDev() {
        navigate("/devinfo", { state: { page: "Credential" }});
    }

    function back() {
        history.back();
    }
</script>

<style>
    main {
        display: flex;
		flex-direction: column;
        justify-content: flex-start;
        background-color: #F8F8F8;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		height: 100%;
		width: 100%;
        position: absolute;
        z-index: 7;
    }

    header {
        margin-bottom: 5vh;
    }

    .wrapper {
        text-align: center;
        padding-bottom: 5vh;
        max-height: 36vh;
        background: linear-gradient(90deg, #00FFFF 0%, #0099FF 100%);
        z-index: 2;
    }

    header {
        margin-left: auto;
        margin-right: auto;
        z-index: 1;
        height: fit-content;
        margin-bottom: 0;
    }

    header > p {
        font-family: 'Proxima Nova', sans-serif;
        font-weight: 600;
        font-size: 1.9vh;
        line-height: 3.4vh;
        color: #fff;
        margin: 0;
    }

    section {
        margin: 0 7vw;
        z-index: 2;
        position: relative;
    }

    footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index: 6;
    }

    .credential-logo {
        width: 15%;
    }

    .options-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin: 3.5vh 3.5vh 0 3.5vh;
        z-index: 2;
    }
</style>

<main transition:fly="{{ x: 500, duration: 500 }}">
    <div class="wrapper" style={expired ? 'background: #000000;' : null}>
        <div class="options-wrapper">
            <img src="../assets/delete.svg" on:click="{onDelete}" alt="delete" />
            <img src="../assets/code.svg" on:click="{onClickDev}" alt="code" />
        </div>
        <header>
            {#if !expired}
                <img class="credential-logo" src="../assets/tick-large.svg" alt="valid" />
                <p>VALID CREDENTIAL</p>
            {:else}
                <img class="credential-logo" src="../assets/expire.svg" alt="expired" />
                <p>EXPIRED CREDENTIAL</p>
            {/if}
        </header>
    </div>
    <section>
        <ObjectList object="{scan.vp.verifiableCredential.credentialSubject}" />
    </section>
    <footer>
        <Button style="background: #0099FF; color: white;" label="Done" onClick="{back}" />
    </footer>
</main>
