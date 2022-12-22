<template>
    <!-- 无token时展示 -->
    <div class="unable-get-device title" v-if="!token">{{ t('DEVICES.UNABLE_GET_DEVICE') }}</div>
    <div v-else>
        <!-- 有token无设备时展示 -->
        <p class="no-device title" v-if="!deviceList.length">{{ t('DEVICES.NO_DEVICE') }}</p>
        <!-- 有token有设备时展示 -->
        <div class="device-wrapper" v-else>
            <p class="title">设备设置</p>
            <p class="tip">{{ t('DEVICES.TIP') }}</p>
            <div class="device-list">
                <div class="form-check" v-for="(item, index) in categoryDeviceList" :key="index">
                    <!-- 设备类别 -->
                    <a class="collapse-icon" data-bs-toggle="collapse" :href="'#' + item.categoryName">&gt;</a>
                    <input class="form-check-input" type="checkbox" @change="handleTotalChange(item.device, $event)" :checked="item.checked" />
                    <label class="form-check-label categoryName">{{ item.categoryName }}</label>
                    <!-- 类别下的具体设备 -->
                    <div class="collapse show" :id="item.categoryName" v-for="item1 in item.device" :key="item1.serial_number">
                        <input class="form-check-input" type="checkbox" :checked="item1.checked" @change="handleSingleChange(item1.serial_number, $event)" />
                        <label class="form-check-label">{{ item1.name }}</label>
                        <p class="deviceid">ID: {{ item1.serial_number }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useIHostStore } from '@/stores/iHost';
import { useDeviceStore, type deviceListItem } from '@/stores/device';
import { storeToRefs } from 'pinia';
import { onMounted } from '@vue/runtime-core';

const { t } = useI18n();

const { token, getTokenIP } = storeToRefs(useIHostStore());
const deviceStore = useDeviceStore();
const { deviceList, categoryDeviceList } = storeToRefs(deviceStore);
// 勾选设备类别
const handleTotalChange = (device: deviceListItem[], e: any) => {
    const checked = e.target.checked;
    device.forEach((item) => deviceStore.updateDevicesListChecked(item.serial_number, checked));
    updatePluginConfig();
};
// 勾选具体设备
const handleSingleChange = (v: string, e: any) => {
    const checked = e.target.checked;
    deviceStore.updateDevicesListChecked(v, checked);
    updatePluginConfig();
};
//	根据access_token获取 openapi设备
const getDevicesByAT = async () => {
    const config = { ip: getTokenIP.value, at: token.value };
    const { error, data } = await window.homebridge.request('/getDevices', config);
    if (error === 0) {
        console.log('devices', data.device_list);
        deviceList.value = data.device_list.map((v: any) => ({
            name: v.name,
            serial_number: v.serial_number,
            display_category: v.display_category,
            checked: true
        }));
    }
};
onMounted(() => {
    getDevicesByAT();
});
//	注意！！！
//  任何有关于config的修改，都需要先调用updatePluginConfig方法，这样在点击保存时，才能正确将config写入磁盘
const updatePluginConfig = async () => {
    console.log('updatePluginConfig', deviceList.value);
    const res = await window.homebridge.updatePluginConfig([
        {
            name: 'homebridge-plugin-ihost',
            platform: 'IhostPlatform',
            devices: deviceList.value
        }
    ]);
    console.log(res);
};
// const res = await window.homebridge.updatePluginConfig([{ name: 'homebridge-plugin-ihost', devices }]);
// console.log('🚀 ~ file: App.vue:39 ~ click2 ~ res', res);
</script>

<style lang="scss" scoped>
.title {
    color: #333;
    font-weight: 600;
}
.device-wrapper {
    .tip {
        margin: 6px 0;
    }
}
.form-check {
    position: relative;
    padding-left: 36px;
    .collapse-icon {
        position: absolute;
        left: 0;
        top: 0;
        margin-bottom: 8px;
        color: #4d4d4d;
    }
    .form-check-label {
        color: #333;
    }
    .categoryName {
        margin-bottom: 8px;
    }
    .collapse {
        margin-bottom: 8px;
        .deviceid {
            margin-left: -20px;
            font-size: 12px;
        }
    }
}
</style>
