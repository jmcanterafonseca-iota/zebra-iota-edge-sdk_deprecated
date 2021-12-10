<script>
    export let onClick;
    export let heading;
    export let subheading;
    export let expired;
</script>

<li on:click={onClick}>
    {#if !expired}
        <span class="icon">
            <img class="arrow" src="../assets/tick.svg" alt="valid" />
        </span>
    {:else}
        <span class="icon">
            <img class="arrow" src="../assets/expire-small.svg" alt="expired" />
        </span>
    {/if}
    <div>
        <h5>{heading}</h5>
        <h6>{subheading}</h6>
    </div>
    <img class="arrow" src="../assets/chevron-right.svg" alt="chevron-right" />
</li>

<style>
    li {
      border: 2px solid rgba(217, 225, 238, 0.6);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem 1rem 0.5rem;
    }

    .icon {
      height: 14vw;
      width: 14vw;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .icon > img {
        max-width: 100%;
        max-height: 100%;
    }

    div {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        flex: 1;
        margin-left: 5vw;
        margin-right: 5vw;
    }

    h5 {
        font-family: "Proxima Nova", sans-serif;
        font-weight: 600;
        font-size: 2.7vw;
        line-height: 4vw;
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
        font-size: 4vw;
        line-height: 3.4vw;
        margin: 0;
        color: #051923;
    }
</style>
