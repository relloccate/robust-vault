    type TransferStatsProps = {
        size: number;
        folders: number;
        files: number;
    };

    export type TransferStats = {
        passed: TransferStatsProps;
        transfered: TransferStatsProps;
    };

    export type StoreBackupStatus = {
        /** it is a main key, uses as ID */
        added: number;
        isTransfering: boolean;
        transferStarted: number;
        transferEnded?: number;
        lastFile: {
            transfered: string;
            passed: string;
        };
        stats: TransferStats;
        errors: string[];
    };

    export type StoreBackupItem = {
        /** it is a main key, uses as ID */
        added: number;
        flow: string;
        isEnabled: boolean;
        schedule: {
            isEnabled: boolean;
            interval: number;
        };
        isDirectory: boolean;
        path: {
            from: string;
            to: string;
        };
        blackList: {
            folders: string[];
            files: string[];
        };
    };

    export type StoreBackupItemWithStatus = {
        data: StoreBackupItem;
        status: StoreBackupStatus;
    };

    export type StoreBackupState = {
        isFilled: boolean;
        items: StoreBackupItem[];
        statuses: StoreBackupStatus[];
    };

    export type StoreSettingsObject = Pick<StoreBackupState, 'items' | 'statuses'>;

    export type onEnd = ({ added }: Pick<StoreBackupItem, 'added'>, stats: TransferStats, lastFile: StoreBackupStatus['lastFile']) => void;

    export interface IStoreActions {
        updateTransferStatuses(data: Pick<StoreBackupStatus, 'added' | 'isTransfering' | 'lastFile' | 'stats' | 'transferEnded'>[]): void;
        endTransfer(data: Pick<StoreBackupStatus, 'added' | 'stats' | 'lastFile'>): void;
        startTransfer(added: StoreBackupStatus['added']): void;
        writeError(added: StoreBackupStatus['added'], error: string): void;
    }

    export interface IUpdateTransferStatuses {
        [key: StoreBackupStatus['added']]: StoreBackupStatus;
    }

    export interface IGetItems {
        [key: number]: {
            data: StoreBackupItem;
            status?: StoreBackupStatus;
        };
    }
