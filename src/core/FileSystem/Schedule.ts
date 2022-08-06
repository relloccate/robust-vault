import TransferPool from './TransferPool';
import { useBackupsStore } from 'front/store/backups';

setInterval(() => {
    try {
        if (!useBackupsStore.getItems?.length) return;

        for (const { data, status } of useBackupsStore.getItems) {
            if (data.isEnabled && data.schedule.interval > 0) {
                if (
                    // if backup was runned some time
                    (status && data.schedule.interval + status.transferStarted < Date.now()) ||
                    // if backup is new and wasn't runned yet
                    (!status && data.schedule.interval > 0)
                ) {
                    TransferPool.add(data);
                    TransferPool.start(data);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}, 10000);
