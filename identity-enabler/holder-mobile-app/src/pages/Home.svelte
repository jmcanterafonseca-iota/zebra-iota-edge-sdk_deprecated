<script lang="ts">
    import { Plugins } from "@capacitor/core";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import { navigate } from "svelte-routing";
    import Button from "../components/Button.svelte";
    import ListItem from "../components/ListItem.svelte";
    import FullScreenLoader from "../components/FullScreenLoader.svelte";
    import DevInfo from "./DevInfo.svelte";
    import { credentialPayload } from "../lib/credentialPayload";
    import { ServiceFactory } from "../factories/serviceFactory";
    import { SchemaNames } from "../schemas";
    import { updateStorage, getFromStorage, account, resetAllStores } from "../lib/store";
    import { getRandomUserData, generateRandomId, wait } from "../lib/helpers";
    import type { IdentityService } from "../services/identityService";
    import { showAlert } from "../lib/ui/helpers";
    import { BACK_BUTTON_EXIT_GRACE_PERIOD } from "../config";

    let showTutorial = false;

    const { App, Toast, Modals } = Plugins;

    let loading = false;
    let localCredentials = [];
    let exitOnBack = false;

    onMount(() => App.addListener("backButton", onBack).remove);
    onMount(async () => {
        try {
            const creds = await getFromStorage("credentials");
            localCredentials = Object.values(creds)?.filter(data => data) ?? [];
        } catch (err) {
            console.log(err);
        }
    });

    async function onBack() {
        if (showTutorial) {
            showTutorial = false;
            return;
        }

        if (exitOnBack) {
            // From the home screen, navigating back twice should exit the app
            App.exitApp();
            return;
        }

        exitOnBack = true;
        await Toast.show({
            position: "bottom",
            duration: "short",
            text: "Tap back again to exit"
        });
        await wait(BACK_BUTTON_EXIT_GRACE_PERIOD);
        exitOnBack = false;
    }

    async function generateCredential() {
        if (navigator.onLine === false) {
            await showAlert("Error", "You need Internet connectivity to generate a new Credential");
            return;
        }

        if (loading) {
            return;
        }
        loading = true;
        try {
            const identityService = ServiceFactory.get<IdentityService>("identity");
            const storedIdentity = await identityService.retrieveIdentity();
            const credentials = await getFromStorage("credentials");
            const nonEmpty = Object.values(credentials)?.filter(data => data);
            const credentialKey = Object.keys(credentials)?.[nonEmpty.length];
            let schema;
            let payload = {};
            switch (credentialKey) {
                case "health":
                    schema = SchemaNames.HEALTH_TEST;
                    payload = credentialPayload.health;
                    break;
                case "blood":
                    schema = SchemaNames.BLOOD_TEST;
                    payload = credentialPayload.blood;
                    break;
                case "personal":
                default:
                    const userData = await getRandomUserData();
                    schema = SchemaNames.PERSONAL_DATA;
                    payload = {
                        UserPersonalData: {
                            UserName: {
                                FirstName: $account.name,
                                LastName: userData.name.last
                            },
                            UserDOB: {
                                "Date of Birth": new Date(userData.dob.date).toDateString()
                            },
                            Birthplace: userData.location.city,
                            Nationality: userData.location.country,
                            "Identity Card Number": userData.id.value,
                            "Passport Number": Math.random().toString(36).substring(7).toUpperCase()
                        }
                    };
            }

            const newCredential = await identityService.createSelfSignedCredential(storedIdentity, schema, payload);
            const credentialId = generateRandomId();
            const enrichment = identityService.enrichCredential({ ...newCredential });
            const credential = {
                credentialDocument: { ...newCredential },
                metaInformation: { issuer: "iota" },
                id: credentialId,
                enrichment
            };
            console.log("new credential", credential);
            await updateStorage("credentials", { [credentialKey]: credential });
            localCredentials.push(credential);

            loading = false;
        } catch (err) {
            loading = false;
            console.log(err);
            await showAlert("Error", err.name);
        }
    }

    function onClickDev() {
        showTutorial = true;
    }

    async function onClickReset() {
        let confirmRet = await Modals.confirm({
            title: "Reset the app",
            message: "Are you sure you want to reset the app and delete all credentials?"
        });
        if (confirmRet.value) {
            const identityService = ServiceFactory.get<IdentityService>("identity");
            try {
                await identityService.clearIdentityAndCredentials();
                // Also need to reset persisted Svelte stores
                resetAllStores();
            } catch (e) {
                await Modals.alert({
                    title: "Could not reset",
                    message: e.message
                });
                return;
            }
            navigate("/landing");
        }
    }

    function scan() {
        navigate("/scan");
    }
</script>

<main>
    {#if showTutorial}
        <DevInfo page="Identity" bind:showTutorial />
    {/if}

    {#if loading}
        <FullScreenLoader label="Loading Credential..." />
    {/if}

    {#if !loading && $account}
        <header>
            <div class="options-wrapper">
                <svg
                    on:click={onClickReset}
                    class="options-icon"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6.35872 7.80803L7.95272 7.32003C8.07833 7.28162 8.21028 7.26832 8.34103 7.2809C8.47177 7.29348 8.59876 7.33169 8.71474 7.39335C8.83072 7.45501 8.93342 7.53891 9.01698 7.64026C9.10054 7.74161 9.16331 7.85842 9.20172 7.98403C9.24014 8.10964 9.25343 8.24158 9.24085 8.37233C9.22827 8.50308 9.19006 8.63007 9.1284 8.74605C9.06674 8.86203 8.98284 8.96473 8.8815 9.04829C8.78015 9.13184 8.66333 9.19462 8.53772 9.23303L4.71272 10.403C4.58705 10.4415 4.45504 10.4547 4.32423 10.4421C4.19342 10.4295 4.06639 10.3912 3.95039 10.3294C3.83439 10.2676 3.7317 10.1836 3.6482 10.0822C3.56469 9.98068 3.50201 9.86375 3.46372 9.73803L2.29372 5.91303C2.25531 5.78742 2.24202 5.65547 2.2546 5.52473C2.26718 5.39398 2.30539 5.26699 2.36705 5.15101C2.42871 5.03503 2.5126 4.93233 2.61395 4.84877C2.7153 4.76522 2.83211 4.70244 2.95772 4.66403C3.2114 4.58645 3.48551 4.61283 3.71974 4.73735C3.95398 4.86188 4.12915 5.07435 4.20672 5.32803L4.64672 6.76903C7.05472 3.06003 11.8317 1.46503 16.0727 3.20303C17.341 3.72289 18.48 4.51437 19.4095 5.52179C20.339 6.5292 21.0364 7.72807 21.4527 9.03403C21.4954 9.15983 21.5126 9.29288 21.5033 9.4254C21.494 9.55792 21.4583 9.68725 21.3985 9.80585C21.3386 9.92444 21.2557 10.0299 21.1546 10.1161C21.0536 10.2023 20.9363 10.2675 20.8098 10.3079C20.6832 10.3483 20.5499 10.3631 20.4176 10.3514C20.2852 10.3397 20.1566 10.3017 20.0391 10.2397C19.9216 10.1777 19.8176 10.0929 19.7332 9.99032C19.6489 9.8877 19.5858 9.7693 19.5477 9.64203C19.1253 8.3154 18.3362 7.13531 17.2716 6.23803C16.207 5.34074 14.9104 4.76285 13.5314 4.57108C12.1524 4.37931 10.7473 4.58147 9.47827 5.15424C8.20927 5.72701 7.12814 6.64701 6.35972 7.80803H6.35872ZM18.6857 16.003L16.9107 16.446C16.7822 16.4813 16.6479 16.4905 16.5158 16.4731C16.3837 16.4557 16.2563 16.4121 16.1413 16.3448C16.0263 16.2775 15.9259 16.1879 15.8459 16.0812C15.766 15.9746 15.7083 15.853 15.676 15.7237C15.6437 15.5944 15.6377 15.4599 15.6581 15.3282C15.6785 15.1966 15.7251 15.0703 15.795 14.9568C15.865 14.8434 15.9569 14.7451 16.0654 14.6677C16.1738 14.5902 16.2967 14.5353 16.4267 14.506L20.0697 13.597C20.2595 13.5067 20.473 13.4787 20.6797 13.517C20.8789 13.5432 21.0655 13.6288 21.2153 13.7626C21.3652 13.8963 21.4712 14.0721 21.5197 14.267L22.4877 18.147C22.5451 18.4019 22.5004 18.669 22.3633 18.8914C22.2263 19.1137 22.0076 19.2736 21.7542 19.3368C21.5007 19.4001 21.2326 19.3616 21.0072 19.2297C20.7817 19.0978 20.6168 18.8829 20.5477 18.631L20.2177 17.309C19.2549 18.6946 17.9362 19.7948 16.4005 20.4939C14.8649 21.1929 13.1691 21.4648 11.4919 21.2809C9.81468 21.097 8.21809 20.4642 6.87033 19.4492C5.52257 18.4341 4.47353 17.0743 3.83372 15.513L3.57372 14.879C3.52395 14.7575 3.49861 14.6273 3.49914 14.496C3.49967 14.3647 3.52606 14.2347 3.5768 14.1136C3.62755 13.9925 3.70166 13.8825 3.7949 13.79C3.88814 13.6975 3.99869 13.6243 4.12022 13.5745C4.36568 13.474 4.64102 13.4751 4.88566 13.5776C5.00679 13.6284 5.11674 13.7025 5.20924 13.7957C5.30173 13.8889 5.37495 13.9995 5.42472 14.121L5.68472 14.754C6.19447 15.9979 7.03422 17.0789 8.11334 17.8804C9.19246 18.6819 10.47 19.1735 11.808 19.3022C13.1461 19.4308 14.4939 19.1916 15.7059 18.6104C16.918 18.0291 17.9483 17.1279 18.6857 16.004V16.003Z"
                    />
                </svg>
                <svg on:click={onClickDev} class="options-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.7362 4.06395C15.2551 4.26336 15.5227 4.86915 15.3338 5.41702L10.5456 19.3051C10.3567 19.853 9.78282 20.1355 9.26384 19.936C8.74486 19.7366 8.47727 19.1309 8.66617 18.583L13.4544 4.6949C13.6433 4.14703 14.2172 3.86454 14.7362 4.06395ZM4.41421 12.2561L7.94975 15.9885C8.34027 16.4008 8.34027 17.0692 7.94975 17.4815C7.55922 17.8937 6.92606 17.8937 6.53553 17.4815L2.29289 13.0026C1.90237 12.5904 1.90237 11.9219 2.29289 11.5097L6.53553 7.03085C6.92606 6.61858 7.55922 6.61858 7.94975 7.03085C8.34027 7.44311 8.34027 8.11152 7.94975 8.52379L4.41421 12.2561ZM19.5858 12.2561L16.0503 8.52379C15.6597 8.11152 15.6597 7.44311 16.0503 7.03085C16.4408 6.61858 17.0739 6.61858 17.4645 7.03085L21.7071 11.5097C22.0976 11.9219 22.0976 12.5904 21.7071 13.0026L17.4645 17.4815C17.0739 17.8937 16.4408 17.8937 16.0503 17.4815C15.6597 17.0692 15.6597 16.4008 16.0503 15.9885L19.5858 12.2561Z"
                    />
                </svg>
            </div>
            <div class="avatar" />
        </header>
        <name-wrapper>
            <p>{$account.name}</p>
        </name-wrapper>
        <section>
            {#each localCredentials as credential}
                <div transition:slide class="list">
                    <ListItem
                        onClick={() => navigate("/credential", { state: { credential } })}
                        heading={credential.enrichment ? credential.enrichment.issuerLabel : ""}
                        subheading={credential.enrichment ? credential.enrichment.credentialLabel : ""}
                    />
                </div>
            {/each}
            {#if localCredentials.length < 3}
                <div class="btn-wrapper">
                    <Button
                        style="background: white; color: #051923; display: flex; justify-content: flex-start; padding: 1rem; border: 2px solid rgb(219, 219, 219);"
                        label="Add new credential"
                        onClick={generateCredential}
                    >
                        <svg class="add" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M21 19V14C21 13.7348 20.8946 13.4804 20.7071 13.2929C20.5196 13.1054 20.2652 13 20 13C19.7348 13 19.4804 13.1054 19.2929 13.2929C19.1054 13.4804 19 13.7348 19 14V19H14C13.7348 19 13.4804 19.1054 13.2929 19.2929C13.1054 19.4804 13 19.7348 13 20C13 20.2652 13.1054 20.5196 13.2929 20.7071C13.4804 20.8946 13.7348 21 14 21H19V26C19 26.2652 19.1054 26.5196 19.2929 26.7071C19.4804 26.8946 19.7348 27 20 27C20.2652 27 20.5196 26.8946 20.7071 26.7071C20.8946 26.5196 21 26.2652 21 26V21H26C26.2652 21 26.5196 20.8946 26.7071 20.7071C26.8946 20.5196 27 20.2652 27 20C27 19.7348 26.8946 19.4804 26.7071 19.2929C26.5196 19.1054 26.2652 19 26 19H21Z"
                            />
                        </svg>
                    </Button>
                </div>
            {/if}
        </section>
        <footer>
            <Button style="height: 64px; width: 64px; border-radius: 50%;" onClick={scan}>
                <svg class="scan-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M16 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V16C20 15.7348 20.1054 15.4804 20.2929 15.2929C20.4804 15.1054 20.7348 15 21 15C21.2652 15 21.5196 15.1054 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16V18C22 19.0609 21.5786 20.0783 20.8284 20.8284C20.0783 21.5786 19.0609 22 18 22H6C4.93913 22 3.92172 21.5786 3.17157 20.8284C2.42143 20.0783 2 19.0609 2 18V16C2 15.7348 2.10536 15.4804 2.29289 15.2929C2.48043 15.1054 2.73478 15 3 15C3.26522 15 3.51957 15.1054 3.70711 15.2929C3.89464 15.4804 4 15.7348 4 16V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H8C8.26522 20 8.51957 20.1054 8.70711 20.2929C8.89464 20.4804 9 20.7348 9 21C9 21.2652 8.89464 21.5196 8.70711 21.7071C8.51957 21.8946 8.26522 22 8 22H16C15.7348 22 15.4804 21.8946 15.2929 21.7071C15.1054 21.5196 15 21.2652 15 21C15 20.7348 15.1054 20.4804 15.2929 20.2929C15.4804 20.1054 15.7348 20 16 20ZM4 8C4 8.26522 3.89464 8.51957 3.70711 8.70711C3.51957 8.89464 3.26522 9 3 9C2.73478 9 2.48043 8.89464 2.29289 8.70711C2.10536 8.51957 2 8.26522 2 8V6C2 4.93913 2.42143 3.92172 3.17157 3.17157C3.92172 2.42143 4.93913 2 6 2H8C8.26522 2 8.51957 2.10536 8.70711 2.29289C8.89464 2.48043 9 2.73478 9 3C9 3.26522 8.89464 3.51957 8.70711 3.70711C8.51957 3.89464 8.26522 4 8 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V8ZM20 8V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H16C15.7348 4 15.4804 3.89464 15.2929 3.70711C15.1054 3.51957 15 3.26522 15 3C15 2.73478 15.1054 2.48043 15.2929 2.29289C15.4804 2.10536 15.7348 2 16 2H18C19.0609 2 20.0783 2.42143 20.8284 3.17157C21.5786 3.92172 22 4.93913 22 6V8C22 8.26522 21.8946 8.51957 21.7071 8.70711C21.5196 8.89464 21.2652 9 21 9C20.7348 9 20.4804 8.89464 20.2929 8.70711C20.1054 8.51957 20 8.26522 20 8Z"
                    />
                </svg>
            </Button>
        </footer>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    header {
        height: 155px;
        background-color: #00a7ff;
    }

    name-wrapper {
        padding-top: 1.8rem;
    }

    section {
        flex: 1;
        align-content: space-between;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        z-index: 2;
    }

    .avatar {
        background-image: url("../assets/person.png");
        width: 120px;
        height: 120px;
        background-size: cover;
        background-position: top center;
        background-repeat: no-repeat;
        border-radius: 50%;
        margin: 0 auto;
        border: 15px solid rgba(165, 165, 165, 0.2);
    }

    .list {
        padding: 0 20px;
    }

    .list:not(:last-child) {
        margin-bottom: 3vh;
    }

    .list:last-child {
        margin-bottom: 9vh;
    }

    name-wrapper > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 700;
        font-size: 6vw;
        line-height: 8vw;
        text-align: center;
        color: #131f37;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 1.5rem 3.5vh 0 3.5vh;
    }

    .add {
        width: 3em;
        fill: #00a7ff;
    }

    .options-icon,
    .scan-icon {
        fill: white;
        width: 1.75em;
    }

    .btn-wrapper {
        height: 72px;
        padding: 0 20px;
    }

    footer {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        bottom: 0;
        padding: 2.1vh 0 4.1vh 0;
        z-index: 3;
    }
</style>
