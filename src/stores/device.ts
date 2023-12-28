import { defineStore } from 'pinia';
import i18n from '@/i18n';

const { t } = i18n.global;

// All supported device types
export const deviceCategoryMap = new Map<string, string>([
    ['button', t('CATEGORY.BUTTON')],
    ['plug', t('CATEGORY.PLUG')],
    ['switch', t('CATEGORY.SWITCH')],
    ['light', t('CATEGORY.LIGHT')],
    ['smokeDetector', t('CATEGORY.SMOKE_DETECT')],
    ['contactSensor', t('CATEGORY.DOOR_DETECT')],
    ['motionSensor', t('CATEGORY.PIR_DETECT')],
    ['temperatureSensor', t('CATEGORY.TEMP')],
    ['humiditySensor', t('CATEGORY.HUM')],
    ['temperatureAndHumiditySensor', t('CATEGORY.TEMP_HUM')],
    ['waterLeakDetector', t('CATEGORY.WATER_DETECT')],
    ['curtain', t('CATEGORY.CURTAIN')],
    ['fanLight', t('CATEGORY.FAN_LIGHT')]
]);
// Device Type Classification
export const categoryMap = new Map([
    [t('DEVICES.SWITCH'), ['button', 'plug', 'switch']],
    [t('DEVICES.LIGHT'), ['light']],
    [t('DEVICES.SENSOR'), ['smokeDetector', 'contactSensor', 'motionSensor', 'temperatureSensor', 'humiditySensor', 'temperatureAndHumiditySensor', 'waterLeakDetector']],
    [t('DEVICES.CURTAIN'), ['curtain']],
    [t('DEVICES.OTHER_DEVICES'), ['fanLight']],
    [t('DEVICES.NO_SUPPORTED'), []]
]);

export interface deviceListItem {
    name: string;
    serial_number: string;
    display_category: string;
    checked: boolean;
}
interface deviceStoreState {
    deviceList: deviceListItem[];
}
interface categoryDeviceListItem {
    categoryName: string;
    // select all
    checked: boolean;
    device: deviceListItem[];
    // Whether to support
    support: boolean;
}

export const useDeviceStore = defineStore({
    id: 'device',
    state(): deviceStoreState {
        return {
            deviceList: []
        };
    },
    actions: {
        // Update device check status
        updateDevicesListChecked(str: string, checked: boolean) {
            const index = this.deviceList.findIndex((v) => v.serial_number === str);
            this.deviceList[index].checked = checked;
        }
    },
    getters: {
        // Classified device list
        categoryDeviceList() {
            const res: categoryDeviceListItem[] = [];
            for (let categoryName of categoryMap.keys()) {
                const categories = categoryMap.get(categoryName);
                const device = this.deviceList.filter((item) => {
                    if (categoryName === t('DEVICES.NO_SUPPORTED')) {
                        return !deviceCategoryMap.has(item.display_category);
                    }
                    return categories?.includes(item.display_category);
                });
                if (device.length === 0) continue;
                res.push({
                    categoryName,
                    device,
                    checked: device.every((v) => v.checked === true),
                    support: categoryName !== t('DEVICES.NO_SUPPORTED')
                });
            }
            return res;
        }
    }
});
