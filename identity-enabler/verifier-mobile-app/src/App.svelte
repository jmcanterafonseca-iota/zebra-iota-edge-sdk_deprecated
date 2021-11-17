<script lang="ts">
    import router from "page";
    import Home from "./pages/Home.svelte";
    import DevInfo from "./pages/DevInfo.svelte";
    import Scan from "./pages/Scan.svelte";

    let url = window.location.pathname;

    let page;

    router("/", () => (page = Home));
    router("/home", () => (page = Home));
    router("/scan", () => (page = Scan));
    router("/devinfo", () => (page = DevInfo));

    // Set up the router to start and actively watch for changes
    router.start();
</script>

<main>
    <svelte:component this={page} />
</main>

<style>
    main {
        height: 100%;
    }
</style>
