<template>
    <div class="add">
        <div class="tip">
            <p v-if="step === 1">
                <span>1 STEP</span>
                Select a file or folder you want to backup
            </p>
            <p v-else-if="step === 2">
                <span>2 STEP</span>
                Select a destination
            </p>
            <p v-else-if="step === 3">
                <span>3 STEP</span>
                Check your directories and confirm
            </p>
        </div>
        <div class="stage">
            <div class="one" v-if="step === 1">
                <div class="buttons">
                    <button @click="choose('file', 'from')">
                        <FileSvg />
                        <span>File</span>
                    </button>
                    <button @click="choose('folder', 'from')">
                        <FolderSvg />
                        <span>Folder</span>
                    </button>
                </div>
            </div>
            <div class="two" v-else-if="step === 2">
                <div class="buttons">
                    <button @click="choose('folder', 'to')">
                        <FolderSvg />
                        <span>Folder</span>
                    </button>
                </div>
            </div>
            <div class="three" v-else>
                <div class="from">
                    <div class="path">
                        <span>FROM</span>
                        {{ paths.from.path }}
                    </div>
                </div>
                <div class="other">
                    <button @click="confirm">
                        <span>CONFIRM</span>
                    </button>
                </div>
                <div class="to">
                    <div class="path">
                        <span>TO</span>
                        {{ paths.to.path }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { parsePath, resolvePath } from 'core/Misc';
import { useBackupsStore } from 'front/store/backups';
import { ipcRenderer } from 'electron';

import PlusSvg from 'front/assets/svg/plus.svg';
import FileSvg from 'front/assets/svg/file.svg';
import FolderSvg from 'front/assets/svg/folder.svg';
import UpdateSvg from 'front/assets/svg/update.svg';
import CloseSvg from 'front/assets/svg/close.svg';

export default {
    data() {
        return {
            step: 1,
            paths: {
                from: {
                    isDirectory: null,
                    path: null
                },
                to: {
                    isDirectory: null,
                    path: null
                }
            }
        };
    },
    components: { PlusSvg, FileSvg, UpdateSvg, FolderSvg, CloseSvg },
    methods: {
        async choose(type, destination) {
            const path = await ipcRenderer.invoke('choose-path', type === 'folder' ? false : true);
            const isDirectory = type === 'folder' ? true : false;

            if (path) {
                if (destination === 'from') {
                    this.paths.from = {
                        path,
                        isDirectory
                    };

                    this.step++;
                }

                if (destination === 'to') {
                    const { name, extension } = parsePath(this.paths.from.path);
                    const nextPath = resolvePath(path + '/' + name);

                    this.paths.to = {
                        path: `${nextPath}${extension ? extension : ''}`,
                        isDirectory
                    };

                    this.step++;
                }
            }
        },
        confirm() {
            if (this.paths.from.path !== this.paths.to.path) {
                useBackupsStore.add({
                    added: Date.now(),
                    flow: 'dumb',
                    isDirectory: this.paths.from.isDirectory,
                    path: {
                        from: this.paths.from.path,
                        to: this.paths.to.path
                    }
                });

                this.step = 1;
                this.paths = {
                    from: {
                        isDirectory: null,
                        path: null
                    },
                    to: {
                        isDirectory: null,
                        path: null
                    }
                };
            }
        }
    }
};
</script>
<style lang="postcss" scoped>
.add {
    margin-top: 4em;
    border-radius: 0.75em;
    background-color: var(--white-color);
    border-bottom: 2px solid color-mod(var(--grey-color) a(5%));

    & .tip {
        padding: 1rem;
        border-bottom: 2px solid color-mod(var(--grey-color) a(5%));
        font-weight: 600;
        font-size: 0.85em;
        color: var(--grey-color);

        & p {
            margin: 0;
            padding: 0;

            & span {
                display: inline-flex;
                padding: 0.5rem 1.25rem;
                border-radius: 0.75em;
                background-color: var(--blue-color);
                color: var(--back-color);
                margin-right: 1em;
            }
        }
    }

    & .stage {
        display: flex;
        align-items: center;
        padding: 1rem;

        & .one {
            width: 100%;

            & .buttons {
                display: flex;
                justify-content: space-between;

                & button {
                    justify-content: center;
                    width: calc(50% - 0.5em);
                }
            }
        }

        & .two {
            width: 100%;

            & .buttons {
                display: flex;

                & button {
                    justify-content: center;
                    width: 100%;
                }
            }
        }

        & .three {
            width: 100%;
            display: flex;
            align-items: center;
            color: var(--grey-color);
            font-weight: 600;
            font-size: 0.85em;

            & div > span {
                display: inline-flex;
                color: var(--blue-color);
                margin-right: 0.5rem;
            }

            & .path {
                padding: 1rem;
                border-radius: 0.75rem;
                border: 2px solid color-mod(var(--grey-color) a(5%));
            }

            & .from {
                width: 35%;

                & button {
                    margin-right: 0.75rem;
                }
            }

            & .other {
                padding: 0 1.5rem;
                width: 30%;

                & button {
                    width: 100%;
                    justify-content: center;
                }
            }

            & .to {
                margin-left: auto;
                width: 35%;

                & button {
                    margin-right: 0.75rem;
                }
            }
        }
    }
}
</style>
