<template>
    <footer>
        <div class="wrap">
            <div class="version">
                Version <span>{{ APP_VERSION }}</span>
            </div>
        </div>
    </footer>
</template>
<script setup>
import { APP_VERSION } from 'core/Constants';
</script>
<style lang="postcss" scoped>
footer {
    margin: auto;
    margin-top: 8em;
    width: 100%;
    max-width: 1550px;

    & .wrap {
        border-radius: 0.75em 0.75em 0 0;
        padding: 1.25em 2em;
        background-color: var(--white-color);

        & .version {
            display: flex;
            align-items: center;
            font-weight: 600;
            font-size: 0.85em;
            color: var(--grey-color);

            & span {
                display: inline-flex;
                margin-left: 1rem;
                padding: 0.2rem 0.5rem;
                border-radius: 0.75rem;
                background-color: var(--back-color);
                color: var(--blue-color);
            }
        }
    }
}
</style>
