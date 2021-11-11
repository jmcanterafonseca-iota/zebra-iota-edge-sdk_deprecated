import App from "./App.svelte";
import { ServiceFactory, IdentityService } from "@zebra-iota-edge-sdk/common";
import { IOTA_NODE_URL, DEVNET } from "./config";
import type { IdentityConfig } from "@zebra-iota-edge-sdk/common";

const config: IdentityConfig = {
    node: IOTA_NODE_URL,
    network: DEVNET ? "dev" : "main"
};

ServiceFactory.register("identity", () => new IdentityService(config));

const app = new App({
    target: document.body,
    props: {
        name: "zebra"
    }
});

export default app;
