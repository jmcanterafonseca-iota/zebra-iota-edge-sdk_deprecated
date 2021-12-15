<script>
    import { onMount } from "svelte";
    import Markdown from "../components/Markdown.svelte";
    import { getMarkdownContent } from "../lib/helpers";
    import { TUTORIAL_BASE_URL } from "../config";
    import { loadingScreen } from "../lib/store";

    export let page = "";
    export let showTutorial = Boolean;

    let code = "";

    onMount(async () => {
        loadingScreen.set("Loading...");
        try {
            code = await getMarkdownContent(`${TUTORIAL_BASE_URL}/${page}.md`);
        } catch (err) {
            error.set("Error getting markdown file. Please try again.");
        }
        loadingScreen.set();
    });

    function onClose() {
        showTutorial = false;
    }
</script>

<main>
    <div class="header-wrapper">
        <span>{page.toUpperCase()}</span>
        <svg on:click={onClose} class="close" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M35.5035 31.7329L44.9302 22.3035C45.1849 22.0575 45.388 21.7633 45.5278 21.4379C45.6675 21.1126 45.7411 20.7627 45.7442 20.4086C45.7473 20.0545 45.6798 19.7034 45.5457 19.3756C45.4116 19.0479 45.2136 18.7502 44.9632 18.4998C44.7129 18.2494 44.4151 18.0514 44.0874 17.9173C43.7597 17.7832 43.4085 17.7158 43.0544 17.7189C42.7004 17.7219 42.3505 17.7955 42.0251 17.9352C41.6998 18.075 41.4055 18.2782 41.1595 18.5329L31.7302 27.9595L22.3035 18.5329C22.0575 18.2782 21.7633 18.075 21.4379 17.9352C21.1126 17.7955 20.7627 17.7219 20.4086 17.7189C20.0545 17.7158 19.7034 17.7832 19.3756 17.9173C19.0479 18.0514 18.7502 18.2494 18.4998 18.4998C18.2494 18.7502 18.0514 19.0479 17.9173 19.3756C17.7832 19.7034 17.7158 20.0545 17.7189 20.4086C17.7219 20.7627 17.7955 21.1126 17.9352 21.4379C18.075 21.7633 18.2782 22.0575 18.5329 22.3035L27.9595 31.7302L18.5329 41.1595C18.2782 41.4055 18.075 41.6998 17.9352 42.0251C17.7955 42.3505 17.7219 42.7004 17.7189 43.0544C17.7158 43.4085 17.7832 43.7597 17.9173 44.0874C18.0514 44.4151 18.2494 44.7129 18.4998 44.9632C18.7502 45.2136 19.0479 45.4116 19.3756 45.5457C19.7034 45.6798 20.0545 45.7473 20.4086 45.7442C20.7627 45.7411 21.1126 45.6675 21.4379 45.5278C21.7633 45.388 22.0575 45.1849 22.3035 44.9302L31.7302 35.5035L41.1595 44.9302C41.4055 45.1849 41.6998 45.388 42.0251 45.5278C42.3505 45.6675 42.7004 45.7411 43.0544 45.7442C43.4085 45.7473 43.7597 45.6798 44.0874 45.5457C44.4151 45.4116 44.7129 45.2136 44.9632 44.9632C45.2136 44.7129 45.4116 44.4151 45.5457 44.0874C45.6798 43.7597 45.7473 43.4085 45.7442 43.0544C45.7411 42.7004 45.6675 42.3505 45.5278 42.0251C45.388 41.6998 45.1849 41.4055 44.9302 41.1595L35.5035 31.7302V31.7329Z"
            />
        </svg>
    </div>
    <section>
        <div class="box-wrapper">
            <span style="font-weight: 600;"
                >This app doesn’t support adding a new credential, but here’s how it works.</span
            >
        </div>
        <p>
            In the IOTA Identity framework, we have implemented the DID standard according to the iota DID Method
            Specification, which can be viewed here.
            <br /><br />
            An example of DID conforming to the IOTA method specification:
        </p>
        <div class="highlightjs-component">
            <Markdown markdown={code} language="javascript" />
        </div>
    </section>
</main>

<style>
    main {
        height: 100%;
        width: 100%;
        background: white;
        display: flex;
        flex-direction: column;
        position: absolute;
        z-index: 10;
    }

    .header-wrapper {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        background: black;
        padding: 4vh 17.7vh;
        position: relative;
    }

    .header-wrapper > span {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 500;
        font-size: 2vh;
        line-height: 2.3vh;
        color: #fff;
        white-space: nowrap;
    }

    .close {
        position: absolute;
        right: 3.4vh;
        width: 1.75em;
        stroke: white;
        fill: white;
    }

    section {
        background: white;
    }

    section > p {
        font-size: 2vh;
        margin: 0 2.3vh;
    }

    .box-wrapper {
        background: #eeeeee;
        border-radius: 4px;
        padding: 2.15vh 1.15vh;
        margin: 2.4vh 2.3vh;
        font-size: 2vh;
        line-height: 2.3vh;
    }

    .box-wrapper > span {
        overflow-wrap: break-word;
        word-wrap: break-word;
        hyphens: auto;
        font-size: 2vh;
        line-height: 2.3vh;
    }

    .highlightjs-component {
        overflow-wrap: break-word;
        word-wrap: break-word;
        overflow-x: auto;
        background: #eeeeee;
        border-radius: 4px;
        padding: 0 1.15vh;
        margin: 2.4vh 2.3vh;
    }
</style>
