import piniaInstance from './piniaInstance';
import Settings from 'core/Settings';
import { defineStore } from 'pinia';
import type { StoreBackupState, StoreBackupItem, StoreBackupItemWithStatus, StoreBackupStatus, IUpdateTransferStatuses, IGetItems } from 'types/rv';

export const useBackupsStore = defineStore('backups', {
    state: (): StoreBackupState => {
        return {
            isFilled: false,
            items: [],
            statuses: []
        };
    },
    actions: {
        async fill() {
            const { items, statuses } = await Settings.get();

            this.items = items;
            this.statuses = statuses;
            this.isFilled = true;
        },
        add(data: StoreBackupItem): void {
            const { added, path, isDirectory, flow } = data;

            this.items.unshift({
                // defaults
                isEnabled: true,
                schedule: {
                    isEnabled: false,
                    interval: 0
                },
                blackList: {
                    folders: [],
                    files: []
                },
                // inserted
                added,
                path,
                isDirectory,
                flow
            });
        },
        startTransfer(added: StoreBackupStatus['added']): void {
            const element = this.statuses.find(item => item.added === added);

            if (element) {
                // ANTI-BLINKING UI VARIANT, DON'T RESET THE VALUES AFTER PREVIOUS TRANSFER
                element.isTransfering = true;
                element.transferStarted = Date.now();
                element.errors = [];
            } else {
                this.statuses.unshift({
                    added,
                    isTransfering: true,
                    transferStarted: Date.now(),
                    errors: [],
                    lastFile: {
                        transfered: '',
                        passed: ''
                    },
                    stats: {
                        passed: {
                            size: 0,
                            folders: 0,
                            files: 0
                        },
                        transfered: {
                            size: 0,
                            folders: 0,
                            files: 0
                        }
                    }
                });
            }
        },
        updateTransferStatuses(data: StoreBackupStatus[]): void {
            const statuses: IUpdateTransferStatuses = {};

            for (const status of this.statuses) {
                statuses[status.added] = status;
            }

            for (const status of data) {
                statuses[status.added] = {
                    ...statuses[status.added],
                    ...status
                };
            }

            this.statuses = Object.values(statuses);
        },
        endTransfer({ added, stats, lastFile }: StoreBackupStatus): void {
            const element = this.statuses.find(item => item.added === added);

            if (element) {
                element.isTransfering = false;
                element.transferEnded = Date.now();
                element.lastFile = lastFile;
                element.stats = stats;
            }
        },
        writeError(added: StoreBackupStatus['added'], error: string): void {
            const element = this.statuses.find(item => item.added === added);

            if (element) {
                element.errors.push(error);
            }
        },
        remove(added: StoreBackupStatus['added']): void {
            this.items = this.items.filter((item: StoreBackupItem) => item.added !== added);
        },
        updateBlackList({ added, blackList }: StoreBackupItem): void {
            const element = this.items.find(item => item.added === added);
            if (element) element.blackList = blackList;
        },
        updateSchedule(added: StoreBackupItem['added'], interval: number): void {
            const element = this.items.find(item => item.added === added);

            if (element) {
                element.schedule = {
                    isEnabled: interval > 0 ? true : false,
                    interval
                };
            }
        },
        updateSchedules(interval: number): void {
            const schedule = {
                isEnabled: interval > 0 ? true : false,
                interval
            };

            this.items = this.items.map((item: StoreBackupItem) => ({
                ...item,
                schedule
            }));
        },
        toggleEnable(added: StoreBackupItem['added']): void {
            const element = this.items.find(item => item.added === added);
            if (element) element.isEnabled = !element.isEnabled;
        }
    },
    getters: {
        getItems(state): StoreBackupItemWithStatus[] {
            if (!state?.items.length) {
                return [];
            }

            const items: IGetItems = {};

            for (const data of state.items) {
                items[data.added] = {
                    data
                };
            }

            for (const status of state.statuses) {
                try {
                    items[status.added].status = status;
                } catch {}
            }

            return Object.values(items);
        }
    }
})(piniaInstance);

(async () => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    useBackupsStore.$onAction(({ name, after, store }) => {
        if (['updateBlackList', 'add', 'remove', 'toggleEnable', 'updateSchedule', 'endTransfer'].includes(name)) {
            after(() => {
                // SET TIMEOUT BEFORE SAVING, TO AVOID BURSTABLE WRITING TO THE ONE FILE
                if (timeout) clearTimeout(timeout);

                timeout = setTimeout(async () => {
                    await Settings.write({
                        items: store.items,
                        statuses: store.statuses
                    });
                }, 250);
            });
        }
    });
})();
