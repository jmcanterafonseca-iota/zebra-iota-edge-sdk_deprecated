<script lang="ts">
    import { navigate } from "svelte-routing";
    import Button from "../components/Button.svelte";
    import Header from "../components/Header.svelte";
    import { firstLaunch } from "../lib/store";

    function onNext() {
        firstLaunch.set(false);
        navigate("/home");
    }
</script>

<main id="wrapper">
    <div class="content">
        <div>
            <Header text="Scan, verify and store credentials" />
        </div>
        <img src="../assets/landing-1.png" alt="landing-1" />
    </div>
    <footer class="footerContainer">
        <Button label="Next" onClick={onNext} />
    </footer>
</main>

<style>
    main {
        height: 100%;
    }

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 11vh;
    }

    .content > * {
        margin: 3vh 0;
    }

    img {
        mix-blend-mode: multiply;
        max-height: 150px;
    }

    footer {
        position: fixed;
        bottom: 0;
        width: 100%;
    }
</style>
