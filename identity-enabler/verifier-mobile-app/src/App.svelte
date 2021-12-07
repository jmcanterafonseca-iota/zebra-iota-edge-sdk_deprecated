<script lang="ts">
	import { onMount } from 'svelte';
	import { Router, Route, navigate } from 'svelte-routing';
	import Home from './pages/Home.svelte';
	import DevInfo from './pages/DevInfo.svelte';
	import Scan from './pages/Scan.svelte';
	import FullScreenLoader from './components/FullScreenLoader.svelte';
	import InvalidCredential from './pages/InvalidCredential.svelte';
	import { CredentialScanError, processScan } from './lib/scan';
	import ScanInfo from './pages/ScanInfo.svelte';
	import { ServiceFactory } from "./factories/serviceFactory";
	import type { LoaderScreenSvelteStore } from "./lib/stores/LoaderScreenStore";

	let url = window.location.pathname;
	const loaderScreen = ServiceFactory.get<LoaderScreenSvelteStore>("loaderScreen");

	async function onScan(strData: string) {
		try {
			await processScan(strData, "DataWedge");
			navigate("/home");
		} catch (e) {
			let message = e.message;
			let detail;
			if (e instanceof CredentialScanError) {
				detail = e.originalError?.message;
			}
			navigate("/invalid", { state: { error: { message, detail }}});
		}
	}

	onMount(() => {
		// register DataWedge handler
		(window as any).onScan = onScan;
	});
</script>

{#if $loaderScreen.visible }
	<FullScreenLoader label={$loaderScreen.message} />
{:else}
	<main>
		<Router url="{url}">
			<div>
				<Route path="/" component="{Home}" />
				<Route path="/home" component="{Home}" />
				<Route path="/devinfo" component="{DevInfo}" />
				<Route path="/scan" component="{Scan}" />
				<Route path="/invalid" component="{InvalidCredential}" />
				<Route path="/scaninfo" component="{ScanInfo}" />
			</div>
		</Router>
	</main>
{/if}

<style>
	main, div {
		height: 100%
	}
</style>
