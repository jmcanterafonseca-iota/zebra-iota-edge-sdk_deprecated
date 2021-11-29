<script lang="ts">
	import { onMount } from 'svelte';
	import { Router, Route } from 'svelte-routing';
	import Home from './pages/Home.svelte';
	import DevInfo from './pages/DevInfo.svelte';
	import Scan from './pages/Scan.svelte';
	import FullScreenLoader from './components/FullScreenLoader.svelte';
	import InvalidCredential from './components/InvalidCredential.svelte';
	import { invalidCredentialScreen, loaderScreen, scanScreen } from './lib/store';
	import { handleScannerData } from './lib/scan';
	import ScanInfo from './components/ScanInfo.svelte';

	let url = window.location.pathname;

	onMount(() => {
		// register DataWedge handler
		(window as any).onScan = strData => handleScannerData(strData, "DataWedge");
	});
</script>

{#if $loaderScreen.visible }
	<FullScreenLoader label={$loaderScreen.message} />
{/if}
{#if $invalidCredentialScreen.visible }
	<InvalidCredential error={$invalidCredentialScreen.error} />
{/if}
{#if $scanScreen.visible }
	<ScanInfo scan={$scanScreen.scan} />
{/if}

<main>
    {#if loading}
		<FullScreenLoader label="loading QR code..." />
	{/if}
    {#if invalid && !loading}
		<InvalidCredential />
	{/if}
	<Router url="{url}">
		<div>
			<Route path="/" component="{Home}" />
			<Route path="/home" component="{Home}" />
			<Route path="/devinfo" component="{DevInfo}" />
			<Route route="/scan" component="{Scan}" />
		</div>
	</Router>
</main>

<style>
	main, div {
		height: 100%
	}
</style>
