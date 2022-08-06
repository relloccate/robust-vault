<template>
    <div class="list">
        <div class="titles">
            <div class="title-wrap">
                <span>From</span>
            </div>
            <div class="title-wrap">
                <div class="transfer-all full-button" v-if="isHasRunned">
                    <button @click="stop" class="small grey">
                        <CloseSvg />
                        <span>Stop All</span>
                    </button>
                </div>
                <div class="transfer-all" v-else>
                    <button @click="transfer" class="small grey" v-if="getItems?.length > 0" v-tooltip.grey="'Run Force Backup All'">
                        <UpdateSvg />
                    </button>
                </div>
            </div>
            <div class="title-wrap">
                <span>To</span>
            </div>
        </div>
        <div class="items" v-if="getItems?.length > 0">
            <TransfersListItem
                :class="{ disabled: !transfer.data.isEnabled }"
                v-for="transfer in getItems"
                :key="transfer.data.added"
                :added="transfer.data.added"
                :path="transfer.data.path"
                :isEnabled="transfer.data.isEnabled"
                :isDirectory="transfer.data.isDirectory"
                :blackList="transfer.data.blackList"
                :schedule="transfer.data.schedule"
                :flow="transfer.data.flow"
                :status="transfer?.status"
            />
        </div>
        <div class="empty" v-else>
            <EmptySvg />
            <span>Nothing here</span>
        </div>
    </div>
</template>
<script>
import TransfersListItem from 'front/components/backups/TransfersListItem.vue';
import TransferPool from 'core/FileSystem/TransferPool';

import { useBackupsStore } from 'front/store/backups';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import FolderSvg from 'front/assets/svg/folder.svg';
import EmptySvg from 'front/assets/svg/empty.svg';
import UpdateSvg from 'front/assets/svg/update.svg';
import CloseSvg from 'front/assets/svg/close.svg';

export default {
    components: { TransfersListItem, FolderSvg, EmptySvg, UpdateSvg, CloseSvg },
    setup() {
        const { getItems } = storeToRefs(useBackupsStore);
        const isHasRunned = computed(() => {
            try {
                return getItems.value.some(item => item.status?.isTransfering === true);
            } catch {
                return false;
            }
        });

        return {
            getItems,
            // getItems: [
            //     {
            //         data: {
            //             isEnabled: true,
            //             schedule: { isEnabled: true, interval: 3600000 },
            //             blackList: { folders: ['node_modules', '.git', 'dist', 'inkscape-1.2_2022-05-15_dc2aedaf03-x64'], files: [] },
            //             added: 1657409359108,
            //             path: { from: 'C:\\Users\\daemon\\Desktop', to: 'D:\\BACKUP\\Desktop' },
            //             isDirectory: true,
            //             flow: 'dumb'
            //         },
            //         status: {
            //             added: 1657409359108,
            //             isTransfering: false,
            //             transferStarted: 1659715094279,
            //             errors: [],
            //             lastFile: { transfered: '', passed: 'C:\\Users\\daemon\\Desktop\\datas.txt' },
            //             stats: { passed: { size: 4624364702, folders: 107, files: 1631 }, transfered: { size: 0, folders: 0, files: 0 } },
            //             transferEnded: 1659715094972
            //         }
            //     },
            //     {
            //         data: {
            //             isEnabled: true,
            //             schedule: { isEnabled: true, interval: 21600000 },
            //             blackList: { folders: [], files: ['default_app.asar'] },
            //             added: 1657242192569,
            //             path: { from: 'C:\\Users\\daemon\\Downloads', to: 'D:\\BACKUP\\Downloads' },
            //             isDirectory: true,
            //             flow: 'dumb'
            //         },
            //         status: {
            //             added: 1657242192569,
            //             isTransfering: false,
            //             transferStarted: 1659705470741,
            //             errors: [],
            //             lastFile: { transfered: '', passed: 'C:\\Users\\daemon\\Downloads\\robust-vault-v0.1.0-x64-win-installer' },
            //             stats: { passed: { size: 8733241959, folders: 268, files: 1393 }, transfered: { size: 0, folders: 0, files: 0 } },
            //             transferEnded: 1659705471002
            //         }
            //     },
            //     {
            //         data: {
            //             isEnabled: true,
            //             blackList: { folders: [], files: [] },
            //             added: 1654959886338,
            //             path: { from: 'C:\\Users\\daemon\\Documents', to: 'D:\\BACKUP\\Documents' },
            //             schedule: { isEnabled: true, interval: 21600000 },
            //             isDirectory: true,
            //             flow: 'dumb'
            //         },
            //         status: {
            //             added: 1654959886338,
            //             isTransfering: false,
            //             transferStarted: 1659705470741,
            //             errors: [],
            //             lastFile: { transfered: 'D:\\BACKUP\\Documents\\Vital\\available_packs.json', passed: 'C:\\Users\\daemon\\Documents\\sometext.txt' },
            //             stats: { passed: { size: 5079764342, folders: 865, files: 14036 }, transfered: { size: 94468376, folders: 0, files: 23 } },
            //             transferEnded: 1659705472801
            //         }
            //     },
            //     {
            //         data: {
            //             added: 1654491200897,
            //             path: { from: 'D:\\PACKS', to: 'E:\\PACKS' },
            //             isEnabled: false,
            //             isDirectory: true,
            //             schedule: { isEnabled: true, interval: 86400000 },
            //             blackList: { folders: [], files: [] },
            //             flow: 'dumb'
            //         },
            //         status: {
            //             added: 1654491200897,
            //             isTransfering: false,
            //             transferStarted: 1658464190831,
            //             errors: [],
            //             lastFile: { transfered: '', passed: 'D:\\PACKS\\VOICES\\_Vocals\\Vocal.wav' },
            //             stats: { passed: { size: 111982956316, folders: 2256, files: 41631 }, transfered: { size: 0, folders: 0, files: 0 } },
            //             transferEnded: 1658464197838
            //         }
            //     },
            //     {
            //         data: {
            //             added: 1654489665032,
            //             path: { from: 'E:\\myprojects', to: 'D:\\BACKUP\\myprojects' },
            //             isDirectory: true,
            //             schedule: { isEnabled: true, interval: 3600000 },
            //             blackList: { folders: ['node_modules', '.git'], files: [] },
            //             flow: 'dumb',
            //             isEnabled: true
            //         },
            //         status: {
            //             added: 1654489665032,
            //             isTransfering: false,
            //             transferStarted: 1659715094279,
            //             errors: [],
            //             lastFile: { transfered: '', passed: 'E:\\myprojects\\test-ssh\\Test SSH.code-workspace' },
            //             stats: { passed: { size: 439076653, folders: 219, files: 1136 }, transfered: { size: 0, folders: 0, files: 0 } },
            //             transferEnded: 1659715094904
            //         }
            //     },
            //     {
            //         data: {
            //             added: 1654489630703,
            //             path: { from: 'E:\\NEW-PROJECTS', to: 'D:\\BACKUP\\NEW-PROJECTS' },
            //             schedule: { isEnabled: true, interval: 3600000 },
            //             isEnabled: true,
            //             isDirectory: true,
            //             blackList: { folders: ['node_modules', '.git', 'dist'], files: [] },
            //             flow: 'dumb'
            //         },
            //         status: {
            //             added: 1654489630703,
            //             isTransfering: false,
            //             transferStarted: 1659715094279,
            //             errors: [],
            //             lastFile: {
            //                 transfered: 'D:\\BACKUP\\NEW-PROJECTS\\Robust Vault\\src\\renderer\\components\\backups\\TransfersList.vue',
            //                 passed: 'E:\\NEW-PROJECTS\\trash-master\\webpack.config.renderer.babel.js'
            //             },
            //             stats: { passed: { size: 71246898, folders: 443, files: 8913 }, transfered: { size: 7929, folders: 0, files: 2 } },
            //             transferEnded: 1659715096808
            //         }
            //     },
            //     {
            //         data: {
            //             added: 1654476307287,
            //             path: { from: 'C:\\PRESETS', to: 'D:\\BACKUP\\PRESETS' },
            //             isEnabled: true,
            //             isDirectory: true,
            //             blackList: { folders: [], files: [] },
            //             flow: 'dumb',
            //             schedule: { isEnabled: true, interval: 86400000 }
            //         },
            //         status: {
            //             added: 1654476307287,
            //             isTransfering: false,
            //             transferStarted: 1659683865495,
            //             errors: [],
            //             lastFile: { transfered: '', passed: 'C:\\PRESETS\\Serum Presets\\Tables\\Wavetables\\Wavetable 9.wav' },
            //             stats: { passed: { size: 2305623541, folders: 88, files: 5602 }, transfered: { size: 0, folders: 0, files: 0 } },
            //             transferEnded: 1659683867251
            //         }
            //     }
            // ],
            isHasRunned
        };
    },
    methods: {
        stop() {
            TransferPool.stop();
        },
        async transfer() {
            for (const { data } of this.getItems) {
                if (data.isEnabled) {
                    TransferPool.add(data);
                }
            }

            TransferPool.start();
        }
    }
};
</script>
<style lang="postcss" scoped>
.list {
    width: 100%;

    & .titles {
        display: flex;
        padding: 0 1.25rem;

        & .title-wrap {
            &:nth-child(1) {
                width: 30%;

                & > span {
                    border-radius: 0.5em 1rem 1rem 0.5em;
                }
            }

            &:nth-child(2) {
                width: 40%;
                padding: 0 1.25em;

                & button {
                    border-radius: 1rem;
                    margin-bottom: 0.5rem;
                }
            }

            &:nth-child(3) {
                width: 30%;

                & > span {
                    border-radius: 1rem 0.5em 0.5em 1rem;
                }
            }

            & > span {
                height: 2rem;
                display: flex;
                border-radius: 0.5em;
                font-size: 0.8em;
                font-weight: 600;
                background-color: color-mod(var(--grey-color) a(5%));
                padding: 0.5rem 1rem;
                color: var(--grey-color);
                margin: 0 0 0.5rem 0;
            }

            & .transfer-all {
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0 0.5rem;
            }
        }
    }

    & .empty {
        padding: 2em 1.25em;
        border-radius: 0.75em;
        border: 1px solid color-mod(var(--blue-color) a(7%));
        display: flex;
        justify-content: center;
        align-items: center;

        & svg {
            width: 1.25em;
            height: 1.25em;
            margin-right: 1em;
            fill: var(--grey-color);
        }

        & span {
            display: flex;
            color: var(--grey-color);
            font-weight: 600;
            font-size: 0.9em;
        }
    }

    & .items {
        /* border-radius: 0.75em; */
        /* border: 1px solid color-mod(var(--blue-color) a(7%)); */
        /* overflow: hidden; */
    }
}

@media only screen and (max-width: 1200px) {
    .list .titles .title-wrap {
        &:nth-child(1) {
            width: 25%;
        }

        &:nth-child(2) {
            width: 50%;
        }

        &:nth-child(3) {
            width: 25%;
        }
    }
}
</style>
