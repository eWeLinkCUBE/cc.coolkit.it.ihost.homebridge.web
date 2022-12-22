import { createApp } from 'vue';
import App from './App.vue';
import '@homebridge/plugin-ui-utils/dist/ui.interface';
import i18n from './i18n';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persist';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(i18n);
app.mount('#app');
