import 'core/FileSystem/Schedule';

import FileTransferDirectory from './FileTransferDirectory';
import FileTransferSingle from './FileTransferSingle';
import type { StoreBackupItem, IStoreActions, onEnd, StoreBackupStatus } from 'types/rv';
import { useBackupsStore } from 'front/store/backups';

interface IFileTransferInstance {
    [key: StoreBackupStatus['added']]: FileTransferDirectory | FileTransferSingle;
}

class TransferPool {
    private instances: IFileTransferInstance = {};
    private runned: Set<number> = new Set();

    private storeActions: IStoreActions = {
        updateTransferStatuses: useBackupsStore.updateTransferStatuses,
        endTransfer: useBackupsStore.endTransfer,
        startTransfer: useBackupsStore.startTransfer,
        writeError: useBackupsStore.writeError
    };

    private interval: ReturnType<typeof setInterval> | undefined;

    private updateStatuses = () => {
        const items = this.getAllItems();
        const statuses = [];

        for (const added of items) {
            if (this.isRunned({ added })) {
                statuses.push({
                    added,
                    isTransfering: true,
                    lastFile: this.instances[added].lastFile,
                    stats: this.instances[added].stats
                });
            }
        }

        this.storeActions.updateTransferStatuses(statuses);
    };

    private getAllItems = (): number[] => {
        return Object.keys(this.instances).map(added => Number(added));
    };

    private isRunned = ({ added }: Pick<StoreBackupItem, 'added'>) => {
        return this.runned.has(added);
    };

    private onEnd: onEnd = ({ added }, stats, lastFile) => {
        this.storeActions.endTransfer({
            added,
            lastFile,
            stats
        });

        this.runned.delete(added);
        delete this.instances[added];

        if (this.getAllItems().length === 0) {
            if (this.interval) clearInterval(this.interval);
        }
    };

    add = (data: StoreBackupItem) => {
        if (this.instances[data.added] !== undefined) return;

        this.instances[data.added] = new (data.isDirectory ? FileTransferDirectory : FileTransferSingle)(data, {
            onEnd: this.onEnd,
            writeError: this.storeActions.writeError
        });
    };

    start = (data: StoreBackupItem) => {
        if (data?.added) {
            if (this.isRunned(data)) return;

            this.storeActions.startTransfer(data.added);
            this.instances[data.added].transfer();
            this.runned.add(data.added);
        } else {
            const items = this.getAllItems();

            for (const added of items) {
                if (this.isRunned({ added })) return;

                this.storeActions.startTransfer(added);
                this.instances[added].transfer();
                this.runned.add(added);
            }
        }

        this.interval = setInterval(this.updateStatuses, 10);
    };

    stop = (data: StoreBackupItem) => {
        if (data?.added) {
            this.instances[data.added].stop();
        } else {
            const items = this.getAllItems();

            for (const added of items) {
                this.instances[added].stop();
            }
        }
    };
}

export default new TransferPool();
