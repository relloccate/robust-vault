import { readFile, writeFile, rename } from 'fs/promises';
import { resolve } from 'path';
import { HOME_DIR, SETTINGS_FILE_NAME, SETTINGS_DEV_FILE_NAME, IS_DEV, APP_VERSION } from './Constants';
import type { StoreBackupStatus, StoreSettingsObject } from 'types/rv';

export default class Settings {
    static path = resolve(HOME_DIR + '/' + (IS_DEV ? SETTINGS_DEV_FILE_NAME : SETTINGS_FILE_NAME));

    static init = async () => {
        try {
            const json = JSON.stringify(
                {
                    items: [],
                    statuses: []
                },
                null,
                4
            );

            await writeFile(this.path, json, 'utf-8');
        } catch (error) {
            console.error(error);
        }
    };

    static get = async (): Promise<StoreSettingsObject> => {
        try {
            const data = await readFile(this.path, 'utf-8');
            const { items, statuses } = JSON.parse(data);

            // is config is broken
            if (!items) {
                await this.init();
                return await this.get();
            }

            return {
                items,
                statuses: statuses.map((status: StoreBackupStatus) => ({ ...status, isTransfering: false }))
            };
        } catch (error: any) {
            // is a first load and no config, create this
            if (error.code === 'ENOENT') {
                await this.init();
                return await this.get();
            } else if (error.code === 'EPERM') {
                console.error('NO PERMISSIONS TO READ SETTINGS');
                alert('NO PERMISSIONS TO READ SETTINGS');
            }

            return {
                items: [],
                statuses: []
            };
        }
    };

    static write = async ({ items, statuses }: StoreSettingsObject) => {
        try {
            const version = APP_VERSION;
            const json = JSON.stringify({ items, statuses, version }, null, 4);

            await writeFile(this.path + '.rv.safe', json, 'utf-8');
            await rename(this.path + '.rv.safe', this.path);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                this.write({ items, statuses });
            } else if (error.code === 'EPERM') {
                console.error('NO PERMISSIONS TO SET SETTINGS');
                // alert('NO PERMISSIONS TO SET SETTINGS');
            }
        }
    };
}
