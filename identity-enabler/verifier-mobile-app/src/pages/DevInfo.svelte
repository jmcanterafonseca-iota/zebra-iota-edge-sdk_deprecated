<script lang="ts">
	import { onMount } from 'svelte';
	import Markdown from '../components/Markdown.svelte'
	import { getMarkdownContent } from '../lib/helpers';
	import { TUTORIAL_BASE_URL } from '../config';

	const page: string = history.state.page;
	let code: string | undefined;
	let error: Error | undefined;

	onMount(async () => {
		try {
			code = await getMarkdownContent(`${TUTORIAL_BASE_URL}/${page}.md`);
		} catch (err) {
			console.error(err);
			error = err;
		}
	});
</script>

<style>
	main {
			height: 100%;
			width: 100%;
			background: white;
			display: flex;
			flex-direction: column;
	}

	.header-wrapper {
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			background: black;
			padding: 4vh 17.7vh;
			position: relative;
	}

	.header-wrapper > span {
			font-family: 'Proxima Nova', sans-serif;
			font-weight: 500;
			font-size: 2vh;
			line-height: 2.3vh;
			color: #fff;
			white-space: nowrap;
	}

	.close {
			position: absolute;
			right: 3.4vh;
	}

	section {
			background: white;
	}

	section > p {
			font-size: 2vh;
			margin: 0 2.3vh;
	}

	.box-wrapper {
			background: #EEEEEE;
			border-radius: 4px;
			padding: 2.15vh 1.15vh;
			margin: 2.4vh 2.3vh;
			font-size: 2vh;
			line-height: 2.3vh;
	}

	.box-wrapper > span {
			overflow-wrap: break-word;
			word-wrap: break-word;
			hyphens: auto;
			font-size: 2vh;
			line-height: 2.3vh;
	}

	.highlightjs-component {
			overflow-wrap: break-word;
			word-wrap: break-word;
			overflow-x: auto;
			background: #EEEEEE;
			border-radius: 4px;
			padding: 0 1.15vh;
			margin: 2.4vh 2.3vh;
	}
</style>

<main>
	<div class="header-wrapper">
		<span>{page.toUpperCase()}</span>
		<img class="close" on:click={() => history.back()} src="../assets/close.svg" alt="close" />
	</div>

	<section>
		{#if error}
			<div class="box-wrapper">
				<span style="font-weight: 600;">{error.message}</span>	
			</div>
		{:else}
			<div class="box-wrapper">
				<span style="font-weight: 600;">This app doesn’t support adding a new credential, but here’s how it works.</span>	
			</div>
			<p>
				In the IOTA Identity framework, we have implemented the DID standard according to the iota DID Method Specification, 
				which can be viewed here. 
				<br><br>
				An example of DID conforming to the IOTA method specification:
			</p>
			<div class="highlightjs-component">
				<Markdown markdown={code} language="javascript" />
			</div>
		{/if}
	</section>
</main>
