<script lang="ts">
	import { navigate } from "svelte-routing";
	import { slide } from 'svelte/transition';
	import { isExpired } from '../lib/helpers';
	import Button from '../components/Button.svelte';
	import ListItem from '../components/ListItem.svelte';
	import type { IScan } from '../models/types/IScan';
	import { ServiceFactory } from "../factories/serviceFactory";
	import type { ScanSvelteStore } from "../lib/stores/ScanStore";

	const scans = ServiceFactory.get<ScanSvelteStore>("scans");

	function scan() {
        navigate('/scan');
    }

	function onClickDev() {
		navigate("/devinfo", { state: { page: "Presentation" }});
	}

	function onClickScan(scan: IScan) {
		navigate("/scaninfo", { state: { scan }});
	}

	async function onClickReset() {
		scans.reset();
	}

	function getHeading(scan: IScan): string {
		return "IOTA";
	}

	function getSubheading(scan: IScan): string {
		const vcType = scan.vp.verifiableCredential.type;
		return vcType.length ? vcType[vcType.length - 1] : "Unknown";
	}

	function getExpiry(scan: IScan): boolean {
		const issuanceDate = scan.vp.verifiableCredential.issuanceDate;
		return issuanceDate ? isExpired(new Date(issuanceDate)) : false;
	}
</script>

<style>
	main {
			display: flex;
			flex-direction: column;
			height: 100%;
			width: 100%;
	}

	header {
			display: flex;
			flex-direction: column;
			height: 72px;
			background: linear-gradient(90deg, #00FFFF 0%, #0099FF 100%);
	}

	section {
			flex: 1;
			align-content: space-between;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			background: #F8F8F8;
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
		font-family: 'Proxima Nova', sans-serif;
		font-weight: 600;
		font-size: 14px;
		line-height: 16px;
		color: #F8F8F8;
		margin: 0;
		z-index: 1;
	}
	
	.options-wrapper > img {
		cursor: pointer;
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
		font-family: 'Proxima Nova', sans-serif;
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
		background: #F8F8F8;
	}
</style>

<main>
	<header>
		<div class="options-wrapper">
			<img src="../assets/reset.svg" on:click="{onClickReset}" title="Reset scanned credentials" alt="reset" />
			<p>SCANNED CREDENTIALS</p>
			<img class="code" src="../assets/code.svg" on:click="{onClickDev}" alt="code" />
		</div>
	</header>
	<section>
		{#if !$scans.length}
			<div class="empty-wrapper">
				<p>No credentials scanned</p>
			</div>
		{:else}
			{#each $scans as scan}
				<div transition:slide class="list">
					<ListItem
						onClick="{() => onClickScan(scan)}"
						heading={getHeading(scan)}
						subheading={getSubheading(scan)}
						expired={getExpiry(scan)}
					/>
				</div>
			{/each}
		{/if}
	</section>
	<footer>
		<Button style="background: #00A7FF; color: white; height: 64px; width: 64px; border-radius: 50%;" onClick="{scan}">
			<img src="../assets/scan.png" alt="scan" />
		</Button>
	</footer>
</main>