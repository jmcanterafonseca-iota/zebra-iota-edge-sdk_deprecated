<script lang="ts">
    import router from "page";
    import { onMount } from "svelte";
    import Home from "./pages/Home.svelte";
    import {
        Modal,
        ServiceFactory,
        hasSetupAccount,
        KeyChainAdapter,
        IdentityService
    } from "@zebra-iota-edge-sdk/common/dist";
    import CreateQR from "./pages/CreateQR.svelte";
    import CreatePresentation from "./pages/CreatePresentation.svelte";
    import Landing from "./pages/Landing.svelte";
    import Name from "./pages/Name.svelte";
    import Menu from "./pages/Menu.svelte";
    import PresentationJSON from "./pages/PresentationJSON.svelte";
    import DataMatrix from "./pages/DataMatrix.svelte";
    import Credential from "./pages/Credential.svelte";
    import DevInfo from "./pages/DevInfo.svelte";
    import Content from "./modal/Content.svelte";
    import Scan from "./pages/Scan.svelte";
    import RequestCredential from "./pages/RequestCredential.svelte";

    let page;

    router("/home", () => (page = Home));
    router("/menu", () => (page = Menu));
    router("/landing", () => (page = Landing));
    router("/name", () => (page = Name));
    router("/credential", () => (page = Credential));
    router("/scan", () => (page = Scan));
    router("/datamatrix", () => (page = DataMatrix));
    router("/devinfo", () => (page = DevInfo));
    router("/presentationjson", () => (page = PresentationJSON));
    router("/createPresentation", () => (page = CreatePresentation));
    router("/requestcredential", () => (page = RequestCredential));
    router("/createQR", () => (page = CreateQR));

    // Set up the router to start and actively watch for changes
    router.start();

    onMount(async () => {
        if (!$hasSetupAccount) {
            KeyChainAdapter.clear();
            router.show("/landing");
            return;
        }

        const identityService = ServiceFactory.get<IdentityService>("identity");
        const storedIdentity = await identityService.retrieveIdentity();

        if (storedIdentity) {
            console.log("Found identity", storedIdentity);
            router.show("/home");
            return;
        }

        router.show("/landing");
    });
</script>

<main>
    <svelte:component this={page} />
    <Modal>
        <Content />
    </Modal>
</main>

<style>
    main {
        height: 100%;
    }
</style>
