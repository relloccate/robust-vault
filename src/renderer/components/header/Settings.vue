<template once>
    <div class="settings-data">
        <SettingsStartup />
        <div class="dev" v-if="IS_DEV">YOU IN DEVELOPMENT MODE</div>
    </div>
</template>
<script setup>
import { IS_DEV } from 'core/Constants';
import SettingsStartup from 'front/components/header/SettingsStartup.vue';
</script>
<style lang="postcss" scoped>
.settings-data {
    padding: 2em;
    animation: fade-up 0.3s var(--ease);

    & > span {
        display: inline-flex;
        font-weight: 600;
        color: var(--grey-color);
    }

    & .dev {
        margin-top: 2em;
        padding-top: 2em;
        color: var(--grey-color);
        font-weight: 600;
        border-top: 2px solid var(--back-color);
    }
}
</style>
