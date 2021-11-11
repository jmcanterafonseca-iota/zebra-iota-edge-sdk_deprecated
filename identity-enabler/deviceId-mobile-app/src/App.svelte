<script lang="ts">
    import { Router, Route } from "svelte-routing";
    import { onMount } from "svelte";
    import Home from "./pages/Home.svelte";
    import { ServiceFactory, hasSetupAccount, KeyChainAdapter, IdentityService } from "@zebra-iota-edge-sdk/common";
    import CreateQR from "./pages/CreateQR.svelte";
    import CreatePresentation from "./pages/CreatePresentation.svelte";
    import Landing from "./pages/Landing.svelte";
    import Name from "./pages/Name.svelte";
    import Menu from "./pages/Menu.svelte";
    import PresentationJSON from "./pages/PresentationJSON.svelte";
    import DataMatrix from "./pages/DataMatrix.svelte";
    import Credential from "./pages/Credential.svelte";
    import DevInfo from "./pages/DevInfo.svelte";
    import Content from "./components/modal/Content.svelte";
    import Modal from "./components/modal/Index.svelte";
    import Scan from "./pages/Scan.svelte";
    import RequestCredential from "./pages/RequestCredential.svelte";

    let url = window.location.pathname;
    let displayHome = false;

    onMount(async () => {
        if (!$hasSetupAccount) {
            return KeyChainAdapter.clear();
        }

        const identityService = ServiceFactory.get<IdentityService>("identity");
        const storedIdentity = await identityService.retrieveIdentity();

        if (storedIdentity) {
            console.log("Found identity", storedIdentity);
            displayHome = true;
        }
    });
</script>

<main>
    <Router {url}>
        <div>
            {#if !$hasSetupAccount}
                <Route path="/" component={Landing} />
            {:else if displayHome}
                <Route path="/" component={Home} />
            {/if}
            <Route path="/home" component={Home} />
            <Route path="/menu" component={Menu} />
            <Route path="/landing" component={Landing} />
            <Route path="/name" component={Name} />
            <Route path="/credential" component={Credential} />
            <Route path="/datamatrix" component={DataMatrix} />

            <Route path="/devinfo" component={DevInfo} />
            <Route path="/presentationjson" component={PresentationJSON} />
            <Route path="/requestcredential" component={RequestCredential} />

            <Route path="/createQR" component={CreateQR} />
            <Route route="/scan" component={Scan} />
            <Route path="/createPresentation" component={CreatePresentation} />
        </div>
    </Router>
    <Modal>
        <Content />
    </Modal>
</main>

<style>
    main,
    div {
        height: 100%;
    }
</style>
