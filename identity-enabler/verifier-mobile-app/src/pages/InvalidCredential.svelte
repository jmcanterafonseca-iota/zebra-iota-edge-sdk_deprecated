<script lang="ts">
    import { fly } from 'svelte/transition';
    import Button from '../components/Button.svelte';

    const error = history.state.error as { message: string, detail?: string };

    function done() {
        history.back();
    }
</script>

<style>
    main {
        display: flex;
		flex-direction: column;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		height: 100%;
		width: 100%;
        background: black;

    }

    section {
        z-index: 2;
        height: 100%;
		width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    section > p {
        z-index: 2;
        position: relative;
        justify-content: center;
        align-items: center;
        font-family: 'Proxima Nova', sans-serif;
        font-weight: 600;
        font-size: 1.9vh;
        line-height: 3.4vh;
        color: #fff;
    }

    .credential-logo {
        width: 15%;
    }

    footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index: 6;
    }
</style>

<main transition:fly="{{ y: 200, duration: 500 }}">
    <section>
        <img class="credential-logo" src="../assets/expire.svg" alt="invalid" />
        <p>{error.message}</p>
        {#if error.detail}
            <small>{error.detail}</small>
        {/if}
    </section>
    <footer>
        <Button style="background: #0099FF; color: white;" label="Done" onClick="{done}" />
    </footer>
</main>
