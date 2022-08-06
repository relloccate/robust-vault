<template>
    <div class="updates-data" v-if="getUpdatableReleases.length > 0">
        <div class="amount">
            <span
                ><b>{{ getUpdatableReleases.length }}</b> new versions was released</span
            >
        </div>
        <div class="releases">
            <UpdatesRelease v-for="release in getUpdatableReleases" :key="release.id" :release="release" />
        </div>
    </div>
    <div class="updates-data" v-else>
        <div class="no-updates">No Updates</div>
    </div>
</template>
<script setup>
import UpdatesRelease from 'front/components/header/UpdatesRelease.vue';
import { useUpdatesStore } from 'front/store/updates';

const { getUpdatableReleases } = useUpdatesStore;
</script>
<style lang="postcss" scoped>
.updates-data {
    display: flex;
    flex-flow: column;
    padding: 0 2em 2em 2em;
    animation: fade-up 0.3s var(--ease);

    & .amount {
        margin-bottom: 6em;
        text-align: center;

        & span {
            color: var(--grey-color);
            display: inline-flex;
            width: auto;
            background-color: var(--back-color);
            border-radius: 0 0 0.75em 0.75em;
            padding: 1em 1.5em;

            & b {
                margin-right: 0.5em;
            }
        }
    }

    & .releases {
        color: var(--grey-color);
        width: 100%;
    }

    & .no-updates {
        width: 100%;
        color: var(--grey-color);
        font-size: 1.5em;
        font-weight: 600;
        text-align: center;
        padding: 1.75rem;
        border: 2px dashed color-mod(var(--grey-color) a(5%));
        margin-top: 2rem;
        border-radius: 0.75em;
    }
}
</style>
