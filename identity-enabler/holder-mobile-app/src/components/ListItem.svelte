<script>
    export let onClick;
    export let heading;
    export let subheading;
</script>

<li on:click={onClick}>
    <i class="icon-credential" />
    <div>
        {#if heading}
            <h5>{heading}</h5>
        {/if}
        <h6>{subheading}</h6>
    </div>
    <i class="icon-chevron rotate-180" />
</li>

<style>
    li {
        border: 2px solid rgb(219, 219, 219);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }

    li > i {
        color: rgb(175, 175, 175);
        font-size: 3em;
    }

    div {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        flex: 1;
        padding: 0 1rem;
    }

    h5 {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 0.75em;
        letter-spacing: 0.06em;
        color: #8593ac;
        text-transform: uppercase;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 0 0 0.9vh 0;
    }

    h6 {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 1.1em;
        margin: 0;
        color: #051923;
    }
</style>
