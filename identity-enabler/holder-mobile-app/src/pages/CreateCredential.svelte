<script lang="ts">
    import { onMount } from "svelte";
    import { Spinner, error, storedCredentials, ServiceFactory, SchemaNames } from "@zebra-iota-edge-sdk/common/dist";
    import type { IdentityService } from "@zebra-iota-edge-sdk/common/dist";

    let credentialJSON = "";
    let loading = true;

    onMount(() => {
        setTimeout(async () => {
            const identityService = ServiceFactory.get<IdentityService>("identity");

            error.set(null);

            try {
                const storedIdentity = await identityService.retrieveIdentity();

                const credential = await identityService.createSelfSignedCredential(
                    storedIdentity,
                    SchemaNames.PERSONAL_DATA,
                    {
                        UserContacts: {
                            Email: "email@company.com",
                            Phone: "111-222-3333"
                        }
                    }
                );

                storedCredentials.update(prev =>
                    [...prev, credential].map(cred => {
                        return {
                            credentialDocument: { ...cred },
                            metaInformation: { issuer: "iota", receivedAt: new Date().toISOString() },
                            id: "credentialId",
                            enrichment: null
                        };
                    })
                );

                credentialJSON = JSON.stringify(credential, null, 2);

                loading = false;
            } catch (err) {
                error.set("Error creating identity. Please try again.");
                loading = false;
            }
        }, 500);
    });
</script>

<main>
    <a href="/">Back</a>
    <h1>Credential</h1>
    {#if loading}
        <Spinner />
    {:else}
        <h3>{credentialJSON}</h3>
    {/if}
</main>

<style>
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 2.5em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
</style>
