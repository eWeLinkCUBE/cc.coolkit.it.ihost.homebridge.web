import { storeToRefs } from 'pinia';
import { useIHostStore, type iHostListItem } from '@/stores/iHost';
import { useDeviceStore } from '@/stores/device';
import { getPluginConfig } from './config';

//	根据access_token获取 openapi设备
export const getDevicesByAT = async () => {
    const { iHostList, token, isExpire, isVerify, successGetTokenMac } = storeToRefs(useIHostStore());
    const { deviceList } = storeToRefs(useDeviceStore());
    if (!token.value) return;
    const { ip } = iHostList.value.find((v) => v.mac === successGetTokenMac.value) as iHostListItem;
    const config = { ip, at: token.value };
    const { error, data } = await window.homebridge.request('/getDevices', config);
    if (error === 0) {
        isExpire.value = false;
        console.log('根据at获取设备成功 ===> ', data);
        const configDevicesList = await getPluginConfig();
        const formatDeviceList = data.device_list.map((item: any) => {
            const { name, serial_number, display_category } = item;
            const checked = configDevicesList.find((v) => v.serial_number === serial_number)?.checked ?? true;
            return { name, serial_number, display_category, checked };
        });
        deviceList.value = formatDeviceList;
    } else if (error === 401) {
        console.log('token过期');
        isExpire.value = true;
    }
    isVerify.value = true;
};