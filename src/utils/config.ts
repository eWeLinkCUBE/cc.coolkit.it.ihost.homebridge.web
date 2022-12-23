import { storeToRefs } from 'pinia';
import { useIHostStore, type iHostListItem } from '@/stores/iHost';
import { useDeviceStore } from '@/stores/device';
import { toRaw } from '@vue/runtime-core';

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
    console.log('updatePluginConfig', res);
};
