<template>
    <HeaderMain />
    <section class="content">
        <TransfersList />
        <TransfersListAdd />
    </section>
    <FooterMain />
</template>
<script>
import HeaderMain from 'front/components/header/HeaderMain.vue';
import FooterMain from 'front/components/FooterMain.vue';
import TransfersList from 'front/components/backups/TransfersList.vue';
import TransfersListAdd from 'front/components/backups/TransfersListAdd.vue';
import { IS_DEV } from 'core/Constants';

import PlusSvg from 'front/assets/svg/plus.svg';
import NotesSvg from 'front/assets/svg/notes.svg';

export default {
    components: { HeaderMain, FooterMain, TransfersList, TransfersListAdd, PlusSvg, NotesSvg },
    created() {
        if (IS_DEV) {
            document.title = 'DEV - Robust Vault';
        }
    }
};
</script>
