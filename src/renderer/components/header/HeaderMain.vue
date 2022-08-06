<template>
    <header :class="{ opened: open }">
        <div class="wrap">
            <div class="top">
                <div class="logo">
                    <span>ROBUST VAULT</span>
                </div>
                <div class="icons">
                    <div class="icon" @click="onClick('updates')">
                        <UpdateSvg />
                        <span v-if="useUpdatesStore.getUpdatableReleases.length > 0">{{ useUpdatesStore.getUpdatableReleases.length }}</span>
                    </div>
                    <div class="icon" @click="onClick('settings')">
                        <SettingsSvg />
                    </div>
                </div>
            </div>
            <div class="main-data" v-if="open">
                <Updates v-if="activePage === 'updates'" />
                <Settings v-if="activePage === 'settings'" />
            </div>
        </div>
    </header>
</template>
<script setup>
import { ref } from 'vue';
import { useUpdatesStore } from 'front/store/updates';

import Settings from 'front/components/header/Settings.vue';
import Updates from 'front/components/header/Updates.vue';

import SettingsSvg from 'front/assets/svg/settings.svg';
import UpdateSvg from 'front/assets/svg/update.svg';
// import CloseSvg from 'front/assets/svg/close.svg';

const open = ref(false);
const activePage = ref('');

const onClick = page => {
    if (activePage.value === page) {
        open.value = !open.value;
    } else {
        open.value = true;
        activePage.value = page;
    }
};
</script>
<style lang="postcss" scoped>
header {
    position: fixed;
    top: 0;
    width: calc(100% - 4em);
    height: 3.75em;
    z-index: 2;
    backdrop-filter: saturate(150%) blur(5px);
    transition: height 0.3s var(--ease);

    &.opened {
        height: 100%;

        & .wrap {
            border-radius: 0;
        }
    }

    & .wrap {
        width: 100%;
        max-width: 1550px;
        height: 100%;
        margin: auto;
        background-color: color-mod(var(--white-color) a(90%));
        border-radius: 0 0 0.75em 0.75em;
        overflow: hidden;

        & .top {
            width: 100%;
            display: flex;
        }

        & .main-data {
            border-top: 2px solid var(--back-color);
            overflow-y: auto;
            height: calc(100vh - 3.75em);
        }

        & .logo {
            padding: 1.25em 2em;

            & span {
                display: inline-flex;
                font-weight: 600;
                color: var(--grey-color);
            }
        }

        & .icons {
            display: flex;
            margin-left: auto;
            margin-right: 2em;
            cursor: pointer;
            align-items: center;

            & .icon {
                position: relative;
                margin-right: 1rem;

                &:last-child {
                    margin-right: 0;
                }

                & span {
                    top: -0.6em;
                    right: -0.8em;
                    position: absolute;
                    background-color: var(--blue-color);
                    color: var(--back-color);
                    font-size: 0.8em;
                    font-weight: 600;
                    padding: 0.1em 0.75em;
                    border-radius: 0.75em;
                }

                & svg {
                    width: 1.75em;
                    height: 1.75em;
                    fill: var(--grey-color);

                    &:first-child {
                        width: 1.6em;
                        height: 1.6em;
                    }
                }
            }
        }
    }
}
</style>
