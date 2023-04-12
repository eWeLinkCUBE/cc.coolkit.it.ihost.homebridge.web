import { storeToRefs } from 'pinia';
import { useIHostStore } from '@/stores/iHost';
import { useDeviceStore, deviceCategoryMap } from '@/stores/device';
import { getPluginConfig, updatePluginConfig } from './config';
import i18n from '@/i18n';

const { t } = i18n.global;

// Get the device default name
const getDeviceDefaultName = (manufacturer: string, category: string) => {
    return manufacturer + deviceCategoryMap.get(category);
};

//	Get openapi device according to access_token
export const getDevicesByAT = async () => {
    const { iHostList, token, isExpire, isIPInvalid, successGetTokenMac } = storeToRefs(useIHostStore());
    const { deviceList } = storeToRefs(useDeviceStore());
    if (!token.value) return;
    const iHostItem = iHostList.value.find((v) => v.mac === successGetTokenMac.value);
    const config = { ip: iHostItem?.ip ?? '', at: token.value };
    const { error, data } = await window.homebridge.request('/getDevices', config);
    if (error === 0) {
        // reset error status
        isExpire.value = false;
        isIPInvalid.value = false;
        // update device
        const config = await getPluginConfig();
        const formatDeviceList = data.device_list.map((item: any) => {
            let { name = '', serial_number, display_category, manufacturer } = item;
            !name && (name = getDeviceDefaultName(manufacturer, display_category));
            // Devices that are not currently supported are set to unchecked by default
            const defaultChecked = deviceCategoryMap.has(display_category);
            const checked = config?.ihost?.devices?.find((v) => v.serial_number === serial_number)?.checked ?? defaultChecked;
            return { name, serial_number, display_category, checked };
        });
        deviceList.value = formatDeviceList;
    } else if (error === 1000) {
        isIPInvalid.value = true;
        isExpire.value = false;
        // window.homebridge.toast.error(t('SETTINGS.NET_ERROR'));
    } else {
        isExpire.value = true;
        isIPInvalid.value = false;
    }

    await updatePluginConfig();
};
