import 'front/assets/css/vars.css';
import 'front/assets/css/main.postcss';
import 'front/assets/css/status.postcss';

import App from './App.vue';
import tooltip from 'front/directives/tooltip';
import piniaInstance from './store/piniaInstance';

import { createApp } from 'vue';
import { useUpdatesStore } from './store/updates';
import { useBackupsStore } from './store/backups';

(async () => {
    // fill stores
    await Promise.all([useUpdatesStore.fill(), useBackupsStore.fill()]);

    // then create vue app
    const app = createApp(App);

    app.directive('tooltip', tooltip);
    app.use(piniaInstance);
    app.mount('#app');
})();
