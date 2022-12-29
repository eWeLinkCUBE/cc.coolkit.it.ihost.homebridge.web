<template>
    <div class="header-tab">
        <button :class="['settings', 'btn', active === 0 ? 'btn-primary' : 'btn-secondary']" @click="toggleTab(0)">SETTINGS</button>
        <button :class="['devicesList', 'btn', active === 1 ? 'btn-primary' : 'btn-secondary']" @click="toggleTab(1)">Devices List</button>
    </div>
    <div class="content">
        <Settings v-show="active === 0" />
        <DevicesList v-show="active === 1" />
    </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/runtime-core';
import '@homebridge/plugin-ui-utils/dist/ui.interface';
import { useIHostStore } from './stores/iHost';
import Settings from './views/Settings.vue';
import DevicesList from './views/DevicesList.vue';

// 切换顶部tab
const active = ref(0);
const toggleTab = (num: number) => {
    active.value = num;
};

window.homebridge.showSpinner();

const iHostStore = useIHostStore();
// 监听查询mdns结果
window.homebridge.addEventListener('getMdnsDevices', (event: any) => {
    console.log('get iHost success ===>', event.data);
    const data = event.data.map((v: any) => ({ ...v, mac: '202212250826' }));
    iHostStore.addIHost(data);
});
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
