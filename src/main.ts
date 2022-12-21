import { createApp } from 'vue'
import App from './App.vue'
import '@homebridge/plugin-ui-utils/dist/ui.interface'
import i18n from './i18n'
import { createPinia } from 'pinia'
import piniaPluginPState from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPState)

app.use(pinia)
app.use(i18n)
app.mount('#app')
