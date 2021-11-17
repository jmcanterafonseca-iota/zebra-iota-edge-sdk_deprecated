<script lang="ts"></script>

<main>
    <h1>Home</h1>
    <div class="controls">
        <a href="/createIdentity">
            <button>Create Identity</button>
        </a>
        <a href="/createCredential">
            <button>Create Credential</button>
        </a>
        <a href="/createPresentation">
            <button>Create Presentation</button>
        </a>
    </div>
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
