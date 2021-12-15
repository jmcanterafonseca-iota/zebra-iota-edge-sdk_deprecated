<script>
    import { fly } from "svelte/transition";
    import { Plugins } from "@capacitor/core";
    import { updateStorage } from "../lib/store";
    import Button from "../components/Button.svelte";
    import ObjectList from "../components/ObjectList.svelte";
    import DevInfo from "./DevInfo.svelte";
    import { isExpired } from "../lib/helpers";
    import { navigate } from "svelte-routing";
    import { onMount } from "svelte";

    const { App, Modals } = Plugins;

    let showTutorial = false;
    let credential = window.history.state.credential;
    let expired = isExpired(credential.issuanceDate);

    function onDone() {
        navigate("/home");
    }

    async function onDelete() {
        let confirmRet = await Modals.confirm({
            title: "Delete credential",
            message: "Are you sure you want to delete the credential?"
        });
        if (confirmRet.value) {
            await updateStorage("credentials", { [credential.type[1].split(/\b/)[0].toLowerCase()]: "" });
            // ensure impossible to navigate back to a deleted credential page
            navigate("/home", { replace: true });
        }
    }

    function onClickDev() {
        showTutorial = true;
    }

    function onBack() {
        if (showTutorial) {
            showTutorial = false;
            return;
        }

        window.history.back();
    }

    onMount(() => App.addListener("backButton", onBack).remove);
</script>

<main transition:fly={{ x: 500, duration: 500 }}>
    {#if showTutorial}
        <DevInfo page="Credential" bind:showTutorial />
    {/if}

    {#if !showTutorial}
        <div class="header-wrapper" class:expired>
            <div class="options-wrapper">
                <svg on:click={onDelete} class="options-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18.833 7L18.105 20.11C18.0769 20.6206 17.8542 21.1011 17.4828 21.4526C17.1114 21.8041 16.6194 22 16.108 22H7.892C7.3806 22 6.88863 21.8041 6.51721 21.4526C6.14579 21.1011 5.92313 20.6206 5.895 20.11L5.167 7H5C4.73478 7 4.48043 6.89464 4.29289 6.70711C4.10536 6.51957 4 6.26522 4 6V3C4 2.73478 4.10536 2.48043 4.29289 2.29289C4.48043 2.10536 4.73478 2 5 2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V6C20 6.26522 19.8946 6.51957 19.7071 6.70711C19.5196 6.89464 19.2652 7 19 7H18.833ZM16.83 7H7.17L7.892 20H16.108L16.83 7ZM6 4V5H18V4H6ZM10 9C10.2652 9 10.5196 9.10536 10.7071 9.29289C10.8946 9.48043 11 9.73478 11 10V17C11 17.2652 10.8946 17.5196 10.7071 17.7071C10.5196 17.8946 10.2652 18 10 18C9.73478 18 9.48043 17.8946 9.29289 17.7071C9.10536 17.5196 9 17.2652 9 17V10C9 9.73478 9.10536 9.48043 9.29289 9.29289C9.48043 9.10536 9.73478 9 10 9ZM14 9C14.2652 9 14.5196 9.10536 14.7071 9.29289C14.8946 9.48043 15 9.73478 15 10V17C15 17.2652 14.8946 17.5196 14.7071 17.7071C14.5196 17.8946 14.2652 18 14 18C13.7348 18 13.4804 17.8946 13.2929 17.7071C13.1054 17.5196 13 17.2652 13 17V10C13 9.73478 13.1054 9.48043 13.2929 9.29289C13.4804 9.10536 13.7348 9 14 9Z"
                    />
                </svg>
                <svg on:click={onClickDev} class="options-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M14.7362 4.06395C15.2551 4.26336 15.5227 4.86915 15.3338 5.41702L10.5456 19.3051C10.3567 19.853 9.78282 20.1355 9.26384 19.936C8.74486 19.7366 8.47727 19.1309 8.66617 18.583L13.4544 4.6949C13.6433 4.14703 14.2172 3.86454 14.7362 4.06395ZM4.41421 12.2561L7.94975 15.9885C8.34027 16.4008 8.34027 17.0692 7.94975 17.4815C7.55922 17.8937 6.92606 17.8937 6.53553 17.4815L2.29289 13.0026C1.90237 12.5904 1.90237 11.9219 2.29289 11.5097L6.53553 7.03085C6.92606 6.61858 7.55922 6.61858 7.94975 7.03085C8.34027 7.44311 8.34027 8.11152 7.94975 8.52379L4.41421 12.2561ZM19.5858 12.2561L16.0503 8.52379C15.6597 8.11152 15.6597 7.44311 16.0503 7.03085C16.4408 6.61858 17.0739 6.61858 17.4645 7.03085L21.7071 11.5097C22.0976 11.9219 22.0976 12.5904 21.7071 13.0026L17.4645 17.4815C17.0739 17.8937 16.4408 17.8937 16.0503 17.4815C15.6597 17.0692 15.6597 16.4008 16.0503 15.9885L19.5858 12.2561Z"
                    />
                </svg>
            </div>
            <header>
                {#if !expired}
                    <svg class="icon" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M27.9639 44.6132C27.6139 44.6139 27.2672 44.5455 26.9436 44.4119C26.6201 44.2783 26.3261 44.0821 26.0786 43.8345L14.7666 32.5199C14.5117 32.2741 14.3084 31.98 14.1684 31.6547C14.0284 31.3295 13.9546 30.9796 13.9513 30.6255C13.948 30.2715 14.0152 29.9203 14.149 29.5925C14.2829 29.2646 14.4807 28.9668 14.7309 28.7162C14.9811 28.4657 15.2787 28.2674 15.6063 28.1331C15.9339 27.9988 16.285 27.9311 16.6391 27.9339C16.9932 27.9367 17.3432 28.0101 17.6686 28.1496C17.994 28.2891 18.2884 28.492 18.5346 28.7465L27.9613 38.1732L44.9346 21.2052C45.4346 20.7048 46.1129 20.4236 46.8203 20.4233C47.5277 20.4231 48.2062 20.7039 48.7066 21.2039C49.207 21.7039 49.4882 22.3822 49.4885 23.0896C49.4887 23.797 49.208 24.4755 48.7079 24.9759L29.8493 43.8345C29.6017 44.0821 29.3078 44.2783 28.9843 44.4119C28.6607 44.5455 28.314 44.6139 27.9639 44.6132Z"
                        />
                    </svg>
                    <p>VALID CREDENTIAL</p>
                {:else}
                    <svg class="icon" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M35.5035 31.7329L44.9302 22.3035C45.1849 22.0575 45.388 21.7633 45.5278 21.4379C45.6675 21.1126 45.7411 20.7627 45.7442 20.4086C45.7473 20.0545 45.6798 19.7034 45.5457 19.3756C45.4116 19.0479 45.2136 18.7502 44.9632 18.4998C44.7129 18.2494 44.4151 18.0514 44.0874 17.9173C43.7597 17.7832 43.4085 17.7158 43.0544 17.7189C42.7004 17.7219 42.3505 17.7955 42.0251 17.9352C41.6998 18.075 41.4055 18.2782 41.1595 18.5329L31.7302 27.9595L22.3035 18.5329C22.0575 18.2782 21.7633 18.075 21.4379 17.9352C21.1126 17.7955 20.7627 17.7219 20.4086 17.7189C20.0545 17.7158 19.7034 17.7832 19.3756 17.9173C19.0479 18.0514 18.7502 18.2494 18.4998 18.4998C18.2494 18.7502 18.0514 19.0479 17.9173 19.3756C17.7832 19.7034 17.7158 20.0545 17.7189 20.4086C17.7219 20.7627 17.7955 21.1126 17.9352 21.4379C18.075 21.7633 18.2782 22.0575 18.5329 22.3035L27.9595 31.7302L18.5329 41.1595C18.2782 41.4055 18.075 41.6998 17.9352 42.0251C17.7955 42.3505 17.7219 42.7004 17.7189 43.0544C17.7158 43.4085 17.7832 43.7597 17.9173 44.0874C18.0514 44.4151 18.2494 44.7129 18.4998 44.9632C18.7502 45.2136 19.0479 45.4116 19.3756 45.5457C19.7034 45.6798 20.0545 45.7473 20.4086 45.7442C20.7627 45.7411 21.1126 45.6675 21.4379 45.5278C21.7633 45.388 22.0575 45.1849 22.3035 44.9302L31.7302 35.5035L41.1595 44.9302C41.4055 45.1849 41.6998 45.388 42.0251 45.5278C42.3505 45.6675 42.7004 45.7411 43.0544 45.7442C43.4085 45.7473 43.7597 45.6798 44.0874 45.5457C44.4151 45.4116 44.7129 45.2136 44.9632 44.9632C45.2136 44.7129 45.4116 44.4151 45.5457 44.0874C45.6798 43.7597 45.7473 43.4085 45.7442 43.0544C45.7411 42.7004 45.6675 42.3505 45.5278 42.0251C45.388 41.6998 45.1849 41.4055 44.9302 41.1595L35.5035 31.7302V31.7329Z"
                        />
                    </svg>
                    <p>EXPIRED CREDENTIAL</p>
                {/if}
            </header>
        </div>
        <section>
            <ObjectList object={credential.credentialSubject} />
        </section>
        <footer>
            <Button label="Done" onClick={() => navigate("/home")} />
        </footer>
    {/if}
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        position: relative;
        height: 100%;
    }

    header {
        margin-bottom: 5vh;
    }

    .header-wrapper {
        text-align: center;
        padding-bottom: 3vh;
        background-color: #6165e3;
    }

    .icon {
        width: 64px;
        stroke: white;
        fill: white;
    }

    .header-wrapper.expired {
        background-color: black;
    }

    .options-icon {
        fill: white;
        width: 1.75em;
    }

    header {
        margin-left: auto;
        margin-right: auto;
        z-index: 1;
        height: fit-content;
        margin-bottom: 0;
    }

    header > p {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 1.9vh;
        line-height: 3.4vh;
        color: #fff;
        margin: 0;
    }

    section {
        margin: 0 7vw;
        z-index: 0;
    }

    footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index: 1;
    }

    .options-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 3.5vh 3.5vh 0 3.5vh;
        z-index: 2;
    }
</style>
