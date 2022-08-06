<template>
    <div class="status-top">
        <div class="stats">
            <div class="total">
                <div class="files">
                    <FileSvg />
                    <span>
                        {{ status.stats.passed.files }}
                    </span>
                </div>
                <div class="folders">
                    <FolderSvg />
                    <span>
                        {{ status.stats.passed.folders }}
                    </span>
                </div>
                <div class="size" v-tooltip.grey="'Total Passed'">{{ size.passed.size }} {{ size.passed.mark }}</div>
            </div>
            <div class="progress-wrap" v-if="status.isTransfering">
                <div class="progress" />
            </div>
            <hr v-else />
            <div class="transfered" v-if="status.stats.transfered.files > 0" key="with-changes">
                <div class="files">
                    <FileSvg />
                    <span>
                        {{ status.stats.transfered.files }}
                    </span>
                </div>
                <div class="size" v-tooltip="'Total Transfered'">{{ size.transfered.size }} {{ size.transfered.mark }}</div>
            </div>
            <div class="transfered" v-else key="no-changes">
                <span class="no-files"> No New or Updated Files</span>
            </div>
        </div>
    </div>
    <div class="status-bottom">
        <div class="last-file">
            <div class="passed" @click="showInExplorer(status.lastFile.passed)" v-tooltip.grey="'Show The Last Passed File'">{{ status.lastFile.passed }}</div>
            <div class="transfered" v-if="status.lastFile.transfered" @click="showInExplorer(status.lastFile.transfered)" v-tooltip="'Show The Last Transfered File'">
                {{ status.lastFile.transfered }}
            </div>
        </div>
        <div class="errors" v-if="status.errors.length > 0">
            <div class="error" v-for="error in status.errors" :key="error">{{ error }}</div>
        </div>
        <div class="date">Last Transfer - {{ new Date(status.transferStarted).toLocaleString() }}</div>
    </div>
</template>
<script>
import { bytesToSize, showInExplorer } from 'core/Misc';

import FolderSvg from 'front/assets/svg/folder.svg';
import FileSvg from 'front/assets/svg/file.svg';
import QuestionSvg from 'front/assets/svg/question.svg';

export default {
    components: { FolderSvg, FileSvg, QuestionSvg },
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
    },
    methods: { showInExplorer }
};
</script>
