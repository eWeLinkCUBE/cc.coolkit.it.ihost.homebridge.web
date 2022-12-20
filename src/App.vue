<template>
	<div class="header-tab">
		<button :class="['settings', 'btn', active === 0 ? 'btn-primary' : 'btn-secondary']" @click="click1">SETTINGS</button>
		<button :class="['devicesList', 'btn', active === 1 ? 'btn-primary' : 'btn-secondary']" @click="click2">Devices List</button>
	</div>
	<div class="content">
        <Settings v-show="active === 0" />
        <DevicesList v-show="active === 1" />
		<!-- <p v-show="tab1">tab1</p> -->
		<!-- <p v-show="tab2">tab2</p> -->
		<!-- {{ pluginConfig }} -->
	</div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import '@homebridge/plugin-ui-utils/dist/ui.interface'
import Settings from './views/Settings.vue'
import DevicesList from './views/DevicesList.vue'

const data = ref<any>();
const pluginConfig = ref<any>();

const active = ref(0)
const click1 = () => {
    active.value = 0
}
const click2 = async () => {
    active.value = 1
	//	注意！！！
	//  任何有关于config的修改，都需要先调用updatePluginConfig方法，这样在点击保存时，才能正确将config写入磁盘
	const res = await window.homebridge.updatePluginConfig([
		{ name: 'homebridge-plugin-ihost', devices }
	])
	console.log("🚀 ~ file: App.vue:39 ~ click2 ~ res", res)
}
const devices = [
	{ id: 1, name: 1 },
	{ id: 2, name: 2 },
	{ id: 3, name: 3 },
	{ id: 4, name: 4 },
]
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
})
// window.homebridge.addEventListener('getMdnsDevices', (event: any) => {
// 	console.log("🚀 ~ file: App.vue:47 ~ window.homebridge.addEventListener ~ event", event.data)
// })
//	发起mdns查询，只发起查询
async function queryMdns() {
	await window.homebridge.request('/queryMdns')
}
//	获取access_token
async function getAccessToken() {
	const data = await window.homebridge.request('/getAccessToken');
}
//	根据access_token获取 openapi设备
async function getDevicesByAT(accessToken: string) {
	const devices = await window.homebridge.request('/getDevices', accessToken)
}
</script>
<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
h1, h2, h3, h4, h5, h6, p {
    margin: 0;
    padding: 0;
}
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
    font-size: 14px;
    box-shadow: 0 2px 5px #00000029, 0 2px 10px #0000001f;
}
</style>
