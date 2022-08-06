<template>
    <div class="item">
        <div class="main-data">
            <div class="from">
                <div class="svg-wrap" @click="showInExplorer(path.from, isDirectory)" v-tooltip.grey="`${isDirectory ? 'Open Directory' : 'Show File'}`">
                    <FolderSvg v-if="isDirectory" />
                    <FileSvg v-else />
                </div>
                <span>{{ path.from }}</span>
            </div>
            <div class="other">
                <div class="wrap" v-if="status && status.isTransfering" key="transfering">
                    <div class="full-button">
                        <button class="small blue" @click="stop(added)">
                            <CloseSvg />
                            <span>Stop</span>
                        </button>
                    </div>
                </div>
                <div class="wrap" v-else key="not-transfering">
                    <template v-if="!isEnabled">
                        <div class="toggle full-button">
                            <button class="small grey" @click="toggleEnable(added)" v-tooltip.grey="'Enable'">
                                <ToggleSvg />
                            </button>
                        </div>
                    </template>
                    <template v-else-if="isBlackListOpened">
                        <div class="black-list full-button" v-if="isDirectory">
                            <button class="small red" @click="isBlackListOpened = !isBlackListOpened">
                                <CloseSvg />
                                <span>Back</span>
                            </button>
                        </div>
                    </template>
                    <template v-else-if="isScheduleOpened">
                        <div class="schedule full-button">
                            <button :class="`small ${schedule.interval > 0 ? 'blue' : 'grey'}`" @click="isScheduleOpened = !isScheduleOpened">
                                <CloseSvg />
                                <span>Back</span>
                            </button>
                        </div>
                    </template>
                    <template v-else-if="isRemoving">
                        <div class="remove full-button">
                            <button class="small red svg-size-one" @click="remove(added)">
                                <TrashSvg />
                                <span>Remove</span>
                            </button>
                            <button class="small grey" @click="isRemoving = !isRemoving">
                                <CloseSvg />
                                <span>Back</span>
                            </button>
                        </div>
                    </template>
                    <template v-else>
                        <div class="transfer">
                            <button @click="transfer" class="small" v-tooltip.blue="'Run Force Backup'">
                                <UpdateSvg />
                            </button>
                        </div>
                        <div class="schedule">
                            <button class="small blue" @click="isScheduleOpened = !isScheduleOpened" v-tooltip.blue="'Schedule'" v-if="schedule.isEnabled">
                                <ScheduleSvg />
                                <span>{{ scheduleTitle[schedule.interval] }}</span>
                            </button>
                            <button class="small grey" @click="isScheduleOpened = !isScheduleOpened" v-tooltip.grey="'Schedule'" v-else>
                                <ScheduleSvg />
                                <span>{{ scheduleTitle[schedule.interval] }}</span>
                            </button>
                        </div>
                        <div class="black-list" v-if="isDirectory" v-tooltip.red="`${blackList.folders.length} Folders and ${blackList.files.length} Files in Black List`">
                            <button class="small red" @click="isBlackListOpened = !isBlackListOpened">
                                <BlockSvg />
                                <span>{{ blackList.folders.length }} - {{ blackList.files.length }}</span>
                            </button>
                        </div>
                        <div class="toggle">
                            <button class="small grey" @click="toggleEnable(added)" v-tooltip.grey="'Disable'">
                                <ToggleSvg />
                            </button>
                        </div>
                        <div class="remove">
                            <button class="small grey svg-size-one" @click="isRemoving = !isRemoving" v-tooltip.grey="'Remove'">
                                <TrashSvg />
                            </button>
                        </div>
                    </template>
                </div>
            </div>
            <div class="to">
                <div class="svg-wrap" @click="showInExplorer(path.to, isDirectory)" v-tooltip.grey="`${isDirectory ? 'Open Directory' : 'Show File'}`">
                    <FolderSvg v-if="isDirectory" />
                    <FileSvg v-else />
                </div>
                <span>{{ path.to }}</span>
            </div>
        </div>
        <TransfersListItemBlackList v-if="isBlackListOpened" :folders="blackList.folders" :files="blackList.files" :added="added" />
        <TransfersListItemSchedule v-else-if="isScheduleOpened" :schedule="schedule" :added="added" />
        <template v-if="status && !isScheduleOpened && !isBlackListOpened">
            <TransfersListItemStatusDirectory v-if="isDirectory" :status="status" />
            <TransfersListItemStatusSingle v-else :status="status" />
        </template>
    </div>
</template>
<script>
import TransfersListItemBlackList from 'front/components/backups/TransfersListItemBlackList.vue';
import TransfersListItemSchedule from 'front/components/backups/TransfersListItemSchedule.vue';
import TransfersListItemStatusSingle from 'front/components/backups/TransfersListItemStatusSingle.vue';
import TransfersListItemStatusDirectory from 'front/components/backups/TransfersListItemStatusDirectory.vue';

import TransferPool from 'core/FileSystem/TransferPool';
import { showInExplorer } from 'core/Misc';
import { useBackupsStore } from 'front/store/backups';
import { ref } from 'vue';

import FolderSvg from 'front/assets/svg/folder.svg';
import FileSvg from 'front/assets/svg/file.svg';
import UpdateSvg from 'front/assets/svg/update.svg';
import BlockSvg from 'front/assets/svg/block.svg';
import CloseSvg from 'front/assets/svg/close.svg';
import TrashSvg from 'front/assets/svg/trash.svg';
import ToggleSvg from 'front/assets/svg/toggle.svg';
import ScheduleSvg from 'front/assets/svg/schedule.svg';

export default {
    props: {
        status: Object,
        added: Number,
        path: {
            type: Object,
            from: String,
            to: String
        },
        isEnabled: Boolean,
        isDirectory: Boolean,
        schedule: {
            isEnabled: Boolean,
            interval: Number
        },
        blackList: {
            folders: Array,
            files: Array
        },
        flow: String
    },
    components: {
        TransfersListItemBlackList,
        TransfersListItemSchedule,
        TransfersListItemStatusSingle,
        TransfersListItemStatusDirectory,
        FolderSvg,
        FileSvg,
        UpdateSvg,
        BlockSvg,
        CloseSvg,
        TrashSvg,
        ToggleSvg,
        ScheduleSvg
    },
    setup() {
        const isBlackListOpened = ref(false);
        const isScheduleOpened = ref(false);
        const isRemoving = ref(false);
        const { toggleEnable, remove } = useBackupsStore;
        const scheduleTitle = {
            0: 'OFF',
            300000: '5 M',
            600000: '10 M',
            1800000: '30 M',
            3600000: '1 H',
            10800000: '3 H',
            21600000: '6 H',
            43200000: '12 H',
            86400000: '1 D'
        };

        return {
            scheduleTitle,
            isBlackListOpened,
            isScheduleOpened,
            isRemoving,
            toggleEnable,
            remove,
            showInExplorer
        };
    },
    methods: {
        stop() {
            TransferPool.stop({ added: this.added });
        },
        async transfer() {
            TransferPool.add({
                added: this.added,
                blackList: this.blackList,
                path: this.path,
                isDirectory: this.isDirectory,
                flow: this.flow
            });

            TransferPool.start({ added: this.added });
        }
    }
};
</script>
<style lang="postcss" scoped>
.item {
    display: flex;
    flex-flow: column;
    align-items: center;
    color: var(--grey-color);
    margin-bottom: 2em;
    border: 1px dashed color-mod(var(--blue-color) a(10%));
    border-radius: 0.75em 0.75em 0.25em 0.25em;
    overflow: hidden;

    &.disabled {
        & .main-data .from,
        & .main-data .to,
        &:deep() .status-top .stats,
        &:deep() .status-bottom .last-file,
        &:deep() .status-bottom .date {
            position: relative;

            &:before {
                position: absolute;
                content: '';
                width: 100%;
                height: 100%;
                background-color: color-mod(var(--back-color) a(75%));
            }
        }

        &:deep() .status-top .stats,
        &:deep() .status-bottom .last-file,
        &:deep() .status-bottom .date {
            &:before {
                background-color: color-mod(var(--white-color) a(75%));
            }
        }
    }

    &:last-child {
        margin-bottom: 0;
    }

    & .main-data {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0.75em 1.25em;

        & .from {
            width: 30%;
        }

        & .other {
            /* display: flex; */
            /* justify-content: center; */
            /* text-align: center; */
            width: 40%;
            padding: 0 1.5em;

            & .wrap {
                overflow: hidden;
                overflow-x: auto;
                display: flex;
                border-radius: 1em;
                padding: 0.5em;
                width: 100%;
                /* background-color: color-mod(var(--blue-color) a(5%)); */
                border: 1px dashed color-mod(var(--blue-color) a(10%));

                &::-webkit-scrollbar {
                    height: 4px;
                    overflow: hidden;
                    border-radius: 0.75em;
                }

                &::-webkit-scrollbar-track {
                    background-color: color-mod(var(--grey-color) a(5%));
                    border-radius: 0.75em;
                }

                &::-webkit-scrollbar-thumb {
                    background-color: color-mod(var(--grey-color) a(25%));
                    border-radius: 0.75em;
                }

                & > div {
                    margin-right: 0.5rem;

                    &:last-child {
                        margin-right: 0;
                    }
                }
            }

            & .remove,
            & .toggle {
                & button {
                    margin-right: 0.5rem;

                    &:last-child {
                        margin-right: 0;
                    }
                }
            }

            & .schedule {
                position: relative;

                & span.top {
                    top: -0.75rem;
                    left: 0.25rem;
                    font-weight: 600;
                    font-size: 0.65em;
                    position: absolute;
                    z-index: 1;
                    padding: 0.2rem 0.5rem;
                    border-radius: 0.75rem;
                    background-color: var(--white-color);
                    color: var(--blue-color);

                    &.grey {
                        color: var(--grey-color);
                    }
                }
            }

            & .toggle {
                margin-left: auto;
            }
        }

        & .to {
            width: 30%;
        }

        & .svg-wrap {
            display: flex;
            align-items: center;
            cursor: pointer;
            margin-right: 1em;

            & svg {
                width: 1em;
                min-width: 1em;
                height: 1em;
                min-height: 1em;
                fill: var(--grey-color);
            }
        }

        & > div:not(.other) {
            display: flex;
            align-items: center;

            & span {
                font-weight: 600;
                font-size: 0.8em;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}

@media only screen and (max-width: 1200px) {
    .item .main-data {
        & .from {
            width: 25%;
        }

        & .other {
            width: 50%;
        }

        & .to {
            width: 25%;
        }
    }
}
</style>
