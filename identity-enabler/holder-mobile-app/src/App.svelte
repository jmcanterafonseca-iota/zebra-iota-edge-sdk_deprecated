<script lang="ts">
    import router from "page";
    import { onMount } from "svelte";
    import Home from "./pages/Home.svelte";
    import CreatePresentation from "./pages/CreatePresentation.svelte";
    import Landing from "./pages/Landing.svelte";
    import Name from "./pages/Name.svelte";
    import PresentationJSON from "./pages/PresentationJSON.svelte";
    import DataMatrix from "./pages/DataMatrix.svelte";
    import Credential from "./pages/Credential.svelte";
    import DeviceCredential from "./pages/DeviceCredential.svelte";
    import DevInfo from "./pages/DevInfo.svelte";
    import Scan from "./pages/Scan.svelte";
    import {
        KeyChainAdapter,
        ServiceFactory,
        hasSetupAccount,
        IdentityService,
        Modal
    } from "@zebra-iota-edge-sdk/common/dist";
    import Content from "./modal/Content.svelte";

    let page;

    router("/home", () => (page = Home));
    router("/landing", () => (page = Landing));
    router("/name", () => (page = Name));
    router("/credential", () => (page = Credential));
    router("/devicecredential", () => (page = DeviceCredential));
    router("/scan", () => (page = Scan));
    router("/datamatrix", () => (page = DataMatrix));
    router("/devinfo", () => (page = DevInfo));
    router("/presentationjson", () => (page = PresentationJSON));
    router("/createPresentation", () => (page = CreatePresentation));

    // Set up the router to start and actively watch for changes
    router.start();

    onMount(async () => {
        if (!$hasSetupAccount) {
            return KeyChainAdapter.clear();
        }

        const identityService = ServiceFactory.get<IdentityService>("identity");
        const storedIdentity = await identityService.retrieveIdentity();

        if (storedIdentity) {
            console.log("Found identity", storedIdentity);
            router.replace("/home");
        } else {
            router.replace("/landing");
        }
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
