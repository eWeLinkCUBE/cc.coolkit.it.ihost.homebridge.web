<template>
    <div class="header-tab">
        <button :class="['settings', 'btn', active === 0 ? 'btn-primary' : 'btn-secondary']" @click="click1">SETTINGS</button>
        <button :class="['devicesList', 'btn', active === 1 ? 'btn-primary' : 'btn-secondary']" @click="click2">Devices List</button>
    </div>
    <div class="content">
        <Settings v-if="active === 0" />
        <DevicesList v-else />
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import '@homebridge/plugin-ui-utils/dist/ui.interface';
import Settings from './views/Settings.vue';
import DevicesList from './views/DevicesList.vue';
import { useIHostStore } from '@/stores/iHost';

const active = ref(0);
const click1 = () => {
    active.value = 0;
};
const click2 = async () => {
    active.value = 1;
};
const devices = [
    { id: 1, name: 1 },
    { id: 2, name: 2 },
    { id: 3, name: 3 },
    { id: 4, name: 4 }
];
onMounted(async () => {
    // //	获取磁盘缓存设备信息
    // const accessories = await window.homebridge.getCachedAccessories();
    // data.value = accessories;
    // //	获取当前插件配置文件信息
    // pluginConfig.value = await window.homebridge.getPluginConfig()
    // // window.homebridge.hideSpinner();
    // //	获取 server 信息
    // const serverEnv = window.homebridge.serverEnv
    // console.log('----serverEnv----', serverEnv);
    queryMdns()
});
// window.homebridge.addEventListener('getMdnsDevices', (event: any) => {
//     console.log("🚀 ~ file: App.vue:47 ~ window.homebridge.addEventListener ~ event", event.data)
//     const iHostStore = useIHostStore();
//     const data = event.data.map((v: any) => ({ ...v, mac: Date.now().toString() }))
//     iHostStore.addIHost(data)
// })
//	发起mdns查询，只发起查询
async function queryMdns() {
    await window.homebridge.request('/queryMdns');
}
</script>
<style>
@import url('./assets/style/common.scss');
@import url('./assets/style/reset-bootstrap.scss');
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #808080;
}
.header-tab {
    display: flex;
    padding: 10px;
}
.header-tab .settings {
    flex: 1;
    border-radius: 10px 0 0 10px;
}
.header-tab .devicesList {
    flex: 1;
    border-radius: 0 10px 10px 0;
}
.content {
    margin: 10px;
    padding: 10px;
    font-size: 14px;
    box-shadow: 0 2px 5px #00000029, 0 2px 10px #0000001f;
}
</style>
