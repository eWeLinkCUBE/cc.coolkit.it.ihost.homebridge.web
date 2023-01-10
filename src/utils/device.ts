import { storeToRefs } from 'pinia';
import { useIHostStore } from '@/stores/iHost';
import { useDeviceStore, deviceCategoryMap } from '@/stores/device';
import { getPluginConfig, updatePluginConfig } from './config';
import i18n from '@/i18n';

const { t } = i18n.global;

// 获取设备默认名称
const getDeviceDefaultName = (manufacturer: string, category: string) => {
    return manufacturer + deviceCategoryMap.get(category);
};

//	根据access_token获取 openapi设备
export const getDevicesByAT = async () => {
    const { iHostList, token, isExpire, successGetTokenMac } = storeToRefs(useIHostStore());
    const { deviceList } = storeToRefs(useDeviceStore());
    if (!token.value) return;
    const iHostItem = iHostList.value.find((v) => v.mac === successGetTokenMac.value);
    const config = { ip: iHostItem?.ip ?? '', at: token.value };
    const { error, data } = await window.homebridge.request('/getDevices', config);
    isExpire.value = true;
    if (error === 0) {
        isExpire.value = false;
        console.log('根据at获取设备成功 ===>', data);
        const config = await getPluginConfig();
        const formatDeviceList = data.device_list.map((item: any) => {
            let { name = '', serial_number, display_category, manufacturer } = item;
            !name && (name = getDeviceDefaultName(manufacturer, display_category));
            // 暂不支持的设备默认设为不勾选状态
            const defaultChecked = deviceCategoryMap.has(display_category);
            const checked = config?.ihost?.devices?.find((v) => v.serial_number === serial_number)?.checked ?? defaultChecked;
            return { name, serial_number, display_category, checked };
        });
        deviceList.value = formatDeviceList;
    } else if (error === 401) {
        console.log('token过期', { error });
    } else if (error === 1000) {
        window.homebridge.toast.error(t('SETTINGS.NET_ERROR'));
    }
    await updatePluginConfig();
};
