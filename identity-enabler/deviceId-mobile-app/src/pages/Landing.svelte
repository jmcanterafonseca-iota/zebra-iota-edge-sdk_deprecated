<script>
    import Button from '../components/Button.svelte';
    import Header from '../components/Header.svelte';
    import { navigate } from "svelte-routing";

    const info = 
        {
            header: 'Create and store device digital identity',
            content:
                'Share device credentials and immunity status safely and privately using IOTA’s Identity solution.',
            footer: 'Next'
        };

    function onNext() {
        navigate('name');
    }
</script>

<style>
    main {
        height: 100%;
        background: #F8F8F8;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .content {
        text-align: center;
        align-items: center;
        width: 100%;
        padding: 0 3.4vh;
    }

    .content > img {
        mix-blend-mode: multiply;
        max-height: 150px;
    }

    .info {
        font-family: 'Proxima Nova', sans-serif;
        font-style: normal;
        font-weight: 400;
        font-size: 0.9em;
        line-height: 1.5em;
        color: #6f7a8d;
        text-align: center;
    }

    .headerContainer {
        display: flex;
    }

    .contentContainer {
        display: flex;
    }

    .footerContainer {
        display: flex;
        width: 100%;
    }
</style>

<main id="wrapper">
    <div class="headerContainer">
        <Header text="{info.header}" />
    </div>
    <div class="contentContainer">
        <div class="content">
            <img src="../assets/landing-1.png" alt="landing-1" />
            <p class="info">{info.content}</p>
        </div>
    </div>
    <footer class="footerContainer">
        <Button style="background: #00A7FF; color: white;" label="{info.footer}" onClick="{onNext}" />
    </footer>
</main>
