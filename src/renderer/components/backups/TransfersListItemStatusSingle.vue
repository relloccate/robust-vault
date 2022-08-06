<template>
    <div class="status-top">
        <div class="stats">
            <div class="total">
                <div class="size" v-tooltip.grey="'Passed File Size'">{{ size.passed.size }} {{ size.passed.mark }}</div>
            </div>
            <div class="progress-wrap" v-if="status.isTransfering">
                <div class="progress" />
            </div>
            <hr v-else />
            <div class="transfered" v-if="status.stats.transfered.files > 0">
                <div class="size" v-tooltip="'Transfered File Size'">{{ size.transfered.size }} {{ size.transfered.mark }}</div>
            </div>
            <div class="transfered" v-else>
                <span class="no-files">This File Wasn't Updated</span>
            </div>
        </div>
    </div>
    <div class="status-bottom no-top">
        <div class="errors no-top-margin-border" v-if="status.errors.length > 0">
            <div class="error" v-for="error in status.errors" :key="error">{{ error }}</div>
        </div>
        <div class="date">Last Transfer - {{ new Date(status.transferStarted).toLocaleString() }}</div>
    </div>
</template>
<script>
import { bytesToSize } from 'core/Misc';

export default {
    props: {
        status: Object
    },
    computed: {
        size() {
            return {
                transfered: bytesToSize(this.status.stats.transfered.size),
                passed: bytesToSize(this.status.stats.passed.size)
            };
        }
    }
};
</script>
<style lang="postcss" scoped>
.no-top {
    padding-top: 0;
}

.no-top-margin-border {
    margin-top: 0;
    border-top: none;
}
</style>
