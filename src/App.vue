<template>
	<div>
		<button class="tab-button" :style="tab1 ? { backgroundColor: 'blanchedalmond' } : ''"
			@click="click1">tab1</button>
		<button class="tab-button" :style="tab2 ? { backgroundColor: 'blanchedalmond' } : ''"
			@click="click2">tab2</button>
	</div>
	<div class="content">
		<p v-show="tab1">tab1</p>
		<p v-show="tab2">tab2</p>
		{{ pluginConfig }}
	</div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import '@homebridge/plugin-ui-utils/dist/ui.interface'

const tab1 = ref(true)
const tab2 = ref(false)
const data = ref<any>();
const pluginConfig = ref<any>();

const click1 = () => {
	tab1.value = true
	tab2.value = false
}
const click2 = async () => {
	tab1.value = false
	tab2.value = true
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
	//	获取磁盘缓存设备信息
	const accessories = await window.homebridge.getCachedAccessories();
	data.value = accessories;
	//	获取当前插件配置文件信息
	pluginConfig.value = await window.homebridge.getPluginConfig()
	// window.homebridge.hideSpinner();
	//	获取 server 信息
	const serverEnv = window.homebridge.serverEnv
	console.log('----serverEnv----', serverEnv);
})
window.homebridge.addEventListener('getMdnsDevices', (event: any) => {
	console.log("🚀 ~ file: App.vue:47 ~ window.homebridge.addEventListener ~ event", event.data)
})
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
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

nav {
	padding: 30px;
}

nav a {
	font-weight: bold;
	color: #2c3e50;
}

nav a.router-link-exact-active {
	color: #42b983;
}

.content {
	color: #fff;
}

.tab-button {
	width: 100px;
	padding: 10px;
	border-radius: 10px;
}
</style>
