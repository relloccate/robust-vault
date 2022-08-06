import piniaInstance from './piniaInstance';
import { defineStore } from 'pinia';
import { APP_RELEASES_URL, APP_VERSION } from 'core/Constants';

const transformVersion = (versionString: string) => versionString.split('.').reduce((prev, curr) => `${prev}${curr}`);

export const useUpdatesStore = defineStore('updates', {
    state: () => {
        return {
            isFilled: false,
            isAvailable: false,
            releases: []
        };
    },
    actions: {
        async fill() {
            try {
                if (APP_VERSION) {
                    const response = await fetch(APP_RELEASES_URL);
                    const releases = await response.json();
                    const tagVersion = releases[0].tag_name.slice(1);

                    if (transformVersion(tagVersion) > transformVersion(APP_VERSION)) {
                        this.isAvailable = true;
                        this.releases = releases;
                    }
                }

                this.isAvailable = false;
            } catch {
                this.isAvailable = false;
            } finally {
                this.isFilled = true;
            }
        }
    },
    getters: {
        getUpdatableReleases(state) {
            if (APP_VERSION) {
                const appVersion = transformVersion(APP_VERSION);

                return state.releases.filter(release => {
                    const releaseVersion = transformVersion(release.tag_name.slice(1));

                    if (releaseVersion > appVersion && !release.draft) return true;
                });
            }

            return [];
        }
    }
})(piniaInstance);
