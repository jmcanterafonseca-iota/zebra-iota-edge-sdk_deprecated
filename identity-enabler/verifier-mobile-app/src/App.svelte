<script lang="ts">
    import { Router, Route } from 'svelte-routing';
    
    import Home from './pages/Home.svelte';
    import DevInfo from './pages/DevInfo.svelte';
    import Scan from './pages/Scan.svelte';
    import InvalidCredential from './pages/InvalidCredential.svelte';
	import FullScreenLoader from './components/FullScreenLoader.svelte';
	import { loadingScreen } from './lib/store';

    let url = window.location.pathname;
</script>

<main>
	{#if $loadingScreen}
		<FullScreenLoader label={$loadingScreen} />
	{/if}
	<Router url="{url}">
		<div>
			<Route path="/" component="{Home}" />
			<Route path="/home" component="{Home}" />
			<Route path="/devinfo" component="{DevInfo}" />
			<Route path="/invalid" component="{InvalidCredential}" />
			<Route route="/scan" component="{Scan}" />
		</div>
	</Router>
</main>

<style>
    main, div {
        height: 100%
    }
</style>
