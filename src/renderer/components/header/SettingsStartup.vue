<template>
    <div class="startup">
        <span
            >STARTUP WITH SYSTEM <b v-if="status.length > 0">{{ status }}</b></span
        >
        <div class="buttons">
            <button class="blue" @click="setStartup(true)">Enable</button>
            <button class="blue" @click="setStartup(false)">Disable</button>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { ipcRenderer } from 'electron';

let status = ref('');
let timer;

const setStartup = async state => {
    await ipcRenderer.invoke('set-on-startup', state);
    status.value = 'OK';

    clearTimeout(timer);
    timer = setTimeout(() => {
        status.value = '';
    }, 500);
};
</script>
<style lang="postcss" scoped>
.startup {
    & b {
        margin-left: 1em;
        color: var(--blue-color);
    }

    & span {
        display: flex;
        margin-bottom: 0.5rem;
        font-weight: 600;
        font-size: 0.8em;
        color: var(--grey-color);
    }

    & .buttons button {
        margin-right: 1em;
    }
}
</style>
