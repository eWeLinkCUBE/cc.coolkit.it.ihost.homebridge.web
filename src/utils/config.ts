import { toRaw } from '@vue/runtime-core';
import { storeToRefs } from 'pinia';
import { useIHostStore } from '@/stores/iHost';
import { useDeviceStore, type deviceListItem } from '@/stores/device';
interface IConfig {
    name?: string;
    platform?: string;
    ihost?: {
        ip?: string;
        mac?: string;
        ihostName?: string;
        at?: string;
        isValid?: boolean;
        devices?: deviceListItem[];
    };
    enableDeviceLog?: boolean;
}
// 获取当前插件配置文件信息
export const getPluginConfig = async (): Promise<IConfig> => {
    const config = await window.homebridge.getPluginConfig();
    console.log('getPluginConfig');
    return config[0] ?? {};
};
// 更新当前插件配置文件信息
export const updatePluginConfig = async () => {
    const { iHostList, token, successGetTokenMac, enableDeviceLog } = storeToRefs(useIHostStore());
    const { deviceList } = storeToRefs(useDeviceStore());
    const listItem = iHostList.value.find((v) => v.mac === successGetTokenMac.value);
    const res = await window.homebridge.updatePluginConfig([
        {
            name: 'homebridge-plugin-ewelink-cube',
            platform: 'eWeLinkCUBEPlatform',
            ihost: {
                ip: listItem?.ip ?? '',
                mac: listItem?.mac ?? '',
                ihostName: listItem?.name ?? '',
                at: token.value,
                isValid: true,
                devices: toRaw(deviceList.value)
            },
            enableDeviceLog: enableDeviceLog.value
        }
    ]);
    console.log('updatePluginConfig ===>', res);
};
