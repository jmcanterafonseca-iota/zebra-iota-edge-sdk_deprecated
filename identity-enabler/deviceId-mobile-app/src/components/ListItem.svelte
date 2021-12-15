<script>
    export let onClick;
    export let heading;
    export let subheading;
    export let icon;
</script>

<li on:click={onClick}>
    <svg class="icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M26.9232 14.0982V12.8374L16.6532 12.8365C16.5788 12.8365 16.5185 12.7745 16.5185 12.6981L16.4927 12.1282C16.4491 11.4566 15.9894 11 15.3669 11H11.127C10.5046 11 10 11.5046 10 12.127V27.5077"
            stroke="black"
            stroke-width="1.2"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
        <path
            d="M11.9049 27.3454C11.6834 28.0795 11.0701 28.9003 10.4414 28.9961L26.9385 29.0001C27.561 29.0001 27.8113 28.8353 28.0655 27.8732C28.3197 26.911 30.6951 15.9806 30.6951 15.9806C30.6951 15.7732 30.527 15.605 30.3195 15.605H14.8869C14.6794 15.605 14.5112 15.7732 14.5112 15.9806C14.5112 15.9806 12.1265 26.6114 11.9049 27.3454Z"
            fill="#00A7FF"
            stroke="black"
            stroke-width="1.2"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
    <div>
        {#if heading}
            <h5>{heading}</h5>
        {/if}
        <h6>{subheading}</h6>
    </div>
    <svg class="arrow right" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 6L9 12L15 18" />
    </svg>
</li>

<style>
    li {
        border: 2px solid rgb(219, 219, 219);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }

    .icon {
        width: 3em;
    }

    .arrow {
        width: 2em;
    }

    .arrow {
        fill: none;
        stroke: rgb(175, 175, 175);
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .arrow.right {
        transform: rotate(180deg);
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
