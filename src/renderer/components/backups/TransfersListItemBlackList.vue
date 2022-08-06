<template>
    <div class="black-list">
        <div class="folders">
            <div class="title">Folders: {{ getBlackList.folders.length }}</div>
            <div class="items">
                <textarea cols="30" rows="10" @input="onInputFolders" :value="getFolders" />
                <!-- <div class="item" v-for="folder in folders" :key="folder">{{ folder }}</div> -->
            </div>
        </div>
        <div class="files">
            <div class="title">Files: {{ getBlackList.files.length }}</div>
            <div class="items">
                <textarea cols="30" rows="10" @input="onInputFiles" :value="getFiles" />
                <!-- <div class="item" v-for="file in files" :key="file">{{ file }}</div> -->
            </div>
        </div>
    </div>
</template>
<script>
import { useBackupsStore } from 'front/store/backups';

export default {
    props: {
        folders: Array,
        files: Array,
        added: Number
    },
    created() {
        this.next.folders = this.folders;
        this.next.files = this.files;
    },
    data() {
        return {
            next: {
                folders: [],
                files: []
            }
        };
    },
    setup() {
        const { updateBlackList } = useBackupsStore;

        return {
            updateBlackList
        };
    },
    computed: {
        getFolders() {
            return this.next.folders.join('\n');
        },
        getFiles() {
            return this.next.files.join('\n');
        },
        getBlackList() {
            return {
                folders: this.next.folders.filter(item => item.length > 0),
                files: this.next.files.filter(item => item.length > 0)
            };
        }
    },
    methods: {
        onInput(object, event) {
            this.next[object] = event.target.value.split(/\r?\n/);
            this.updateBlackList({
                added: this.added,
                blackList: this.getBlackList
            });
        },
        onInputFolders(event) {
            this.onInput('folders', event);
        },
        onInputFiles(event) {
            this.onInput('files', event);
        }
    }
};
</script>
<style lang="postcss" scoped>
.black-list {
    display: flex;
    padding: 1em;
    width: 100%;
    justify-content: space-between;
    background-color: var(--white-color);
    animation: fade-up 0.3s var(--ease);

    & .title {
        margin: 0 1rem;
        font-weight: 600;
        font-size: 0.85em;
        color: var(--grey-color);
    }

    & > div {
        padding: 1em;
        border-radius: 0.75em;
        width: calc(50% - 0.5em);
        background-color: var(--back-color);

        & .items {
            margin-top: 1em;
            border-radius: 0.75em;
            /* padding: 1em; */
            background-color: var(--white-color);

            & textarea {
                resize: none;
                width: 100%;
                padding: 1em;
                outline: 0;
                font-weight: 600;
                font-size: 0.85em;
                background-color: var(--white-color);
                color: var(--grey-color);
                border: none;
                border-radius: 0.75em;

                &::-webkit-input-placeholder {
                    color: color-mod(var(--back-color) a(50%));
                }
            }
        }
    }
}
</style>
