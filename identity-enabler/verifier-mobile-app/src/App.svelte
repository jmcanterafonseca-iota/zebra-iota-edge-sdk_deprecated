<script>
	import { onMount } from 'svelte';
	import { Router, Route, navigate } from 'svelte-routing';
	import Home from './pages/Home.svelte';
	import DevInfo from './pages/DevInfo.svelte';
	import Scan from './pages/Scan.svelte';
	import { ServiceFactory } from './factories/serviceFactory';
	import FullScreenLoader from './components/FullScreenLoader.svelte';
	import InvalidCredential from './components/InvalidCredential.svelte';
	import { error, updateStorage } from './lib/store';
	import { parse } from './lib/helpers';
    import { Plugins } from '@capacitor/core';

	let url = window.location.pathname;
	let loading = false;
	let invalid = false;
    const { Toast } = Plugins;

	async function showToast() {
		await Toast.show({
			text: 'Credential verified!',
			position: 'center'
		});
	}

	function showAlert() {
		invalid = true;
		loading = false;
	}

	function goBack() {
		navigate('/home');
	}

	onMount(() => {
		// register DataWedge callback
		window.onScan = async (scannedCodeStr) => {
			try {
				let vp = parse(scannedCodeStr);

				if (!vp) return showAlert();

				const identityService = ServiceFactory.get('identity');
				const verificationResult = await identityService.verifyVerifiablePresentation(vp);

				if (verificationResult) {
					await updateStorage('credentials', { [vp.verifiableCredential.type[1].split(/\b/)[0].toLowerCase()]: vp.verifiableCredential });
					showToast();
					loading = false;
					goBack();
				} else {
					loading = false;
					showAlert();
					error.set('Invalid Data Matrix');
				}
			} catch (err) {
				console.error(err);
			};
		}
	});
</script>

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
