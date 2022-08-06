import { copyFile, mkdir, stat, access } from 'fs/promises';
import type { StoreBackupItem, TransferStats, onEnd, IStoreActions } from 'types/rv';
import type { Stats } from 'fs';

export type NextPath = {
    directory: string;
    fullPath: string;
};

/**
 * SUPER-PUPER GENIUS BELOW, PROFFESSIONAL RECURSER IN 7-TH GENERATION
 */
export default class FileTransferBase {
    protected data: StoreBackupItem;
    protected stopped: boolean = false;

    lastFile = {
        transfered: '',
        passed: ''
    };

    stats: TransferStats = {
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
    };

    protected onEnd: onEnd;
    protected writeError: IStoreActions['writeError'];

    constructor(data: StoreBackupItem, { onEnd, writeError }: { onEnd: onEnd; writeError: IStoreActions['writeError'] }) {
        this.data = data;
        this.onEnd = onEnd;
        this.writeError = writeError;
    }

    stop = (): void => {
        this.stopped = true;
        this.onEnd({ added: this.data.added }, this.stats, this.lastFile);
    };

    protected isBlackListed = (name: string, isDirectory: boolean): boolean => {
        if (isDirectory) {
            return this.data.blackList.folders.includes(name);
        } else {
            return this.data.blackList.files.includes(name);
        }
    };

    protected isFilesTheSame = async (fromStat: Stats, toPath: string): Promise<boolean> => {
        try {
            const toStat: Stats = await stat(toPath);

            return `${fromStat.mtimeMs}${fromStat.size}` === `${toStat.mtimeMs}${toStat.size}`;
        } catch {
            return false;
        }
    };

    protected copyFile = async (from: string, to: NextPath): Promise<void> => {
        try {
            await copyFile(from, to.fullPath);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                // ELECTRON BUG, UNABLE TO MOVE ASAR FILES
                if (error.message.endsWith('.asar')) {
                    this.writeError(this.data.added, `Can't transfer asar files: ${from}, this file was skipped`);
                    return;
                }

                try {
                    await mkdir(to.directory, { recursive: true });
                    return await this.copyFile(from, to);
                } catch {
                    this.writeError(this.data.added, `I Can't Create a Folder: "${to.directory}"`);
                }
            } else if (error.code === 'EPERM') {
                this.writeError(this.data.added, `No Permissions For File Copy: "${from}"`);
            } else if (error.code === 'EEXIST') {
                console.log('EEEEEEEEFAS');
            } else {
                console.log(error);
            }
        }
    };

    protected updateStats = (fileStat: Stats | null, statObject: 'passed' | 'transfered', type: 'folders' | 'files'): void => {
        if (fileStat) this.stats[statObject].size += fileStat.size;
        this.stats[statObject][type]++;
    };

    protected getNotAccessibleDrives = async ({ path }: Pick<StoreBackupItem, 'path'>) => {
        const disks = {
            from: path.from.slice(0, 1),
            to: path.to.slice(0, 1)
        };

        const notAccessible = [];

        try {
            await access(`${disks.from}:`);
        } catch {
            notAccessible.push(`${disks.from}:`);
        }

        try {
            await access(`${disks.to}:`);
        } catch {
            notAccessible.push(`${disks.to}:`);
        }

        return notAccessible;
    };

    /**
     * Wraps transfer function
     */
    protected preTransfer = async (invoke: Function) => {
        try {
            const {
                path: { from, to }
            }: StoreBackupItem = this.data;

            const notAccessibleDrives = await this.getNotAccessibleDrives({ path: { from, to } });

            if (notAccessibleDrives.length > 0) {
                this.writeError(this.data.added, `NOT REACHABLE DRIVES: "${notAccessibleDrives.join(', ')}"`);
            } else {
                await access(from);
                await invoke(from, to);
            }

            this.onEnd({ added: this.data.added }, this.stats, this.lastFile);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                this.writeError(this.data.added, `"From" Data Is Not Exists or Not Accessible`);
            } else if (error?.message) {
                this.writeError(this.data.added, error.message);
            }

            this.onEnd({ added: this.data.added }, this.stats, this.lastFile);
        }
    };
}
