import { toRaw } from '@vue/runtime-core';
import { storeToRefs } from 'pinia';
import { useIHostStore, type iHostListItem } from '@/stores/iHost';
import { useDeviceStore, type deviceListItem } from '@/stores/device';

// 获取当前插件配置文件信息
export const getPluginConfig = async (): Promise<deviceListItem[]> => {
    const { enableDeviceLog } = storeToRefs(useIHostStore());
    const config = await window.homebridge.getPluginConfig();
    console.log('getPluginConfig ===> ', config);
    enableDeviceLog.value = config[0]?.enableDeviceLog ?? false;
    return config[0]?.devices ?? [];
};
// 更新当前插件配置文件信息
export const updatePluginConfig = async () => {
    const { iHostList, token, successGetTokenMac, enableDeviceLog } = storeToRefs(useIHostStore());
    const { deviceList } = storeToRefs(useDeviceStore());
    const { name: ihostName, ip, mac } = iHostList.value.find((v) => v.mac === successGetTokenMac.value) as iHostListItem;
    const res = await window.homebridge.updatePluginConfig([
        {
            name: 'homebridge-plugin-ihost',
            platform: 'IhostPlatform',
            ip,
            mac,
            ihostName,
            at: token.value,
            isValid: true,
            devices: toRaw(deviceList.value),
            enableDeviceLog: enableDeviceLog.value
        }
    ]);
    console.log('updatePluginConfig ===> ', res);
};
