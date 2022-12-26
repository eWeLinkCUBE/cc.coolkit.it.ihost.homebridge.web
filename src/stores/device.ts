import { defineStore } from 'pinia';
import i18n from '@/i18n';

const { t } = i18n.global;

const categoryMap = new Map([
    [t('DEVICES.SWITCH'), ['button', 'plug', 'switch']],
    [t('DEVICES.LIGHT'), ['light']],
    [t('DEVICES.SENSOR'), ['smokeDetector', 'contactSensor', 'motionSensor', 'temperatureSensor', 'humiditySensor', 'temperatureAndHumiditySensor', 'waterLeakDetector']],
    [t('DEVICES.CURTAIN'), ['curtain']]
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
    checked: boolean;
    device: deviceListItem[];
}
const deviceList = [
    {
        name: '无线按键开关',
        serial_number: 'f9404a29-d410-4ec7-a39b-7b57bebadf95',
        display_category: 'button'
    },
    {
        name: '烟雾传感器',
        serial_number: 'ba13a728-6fde-40f1-a5e8-4b4258ed6a27',
        display_category: 'smokeDetector'
    },
    {
        name: '单色灯',
        serial_number: 'b7c30727-e835-497b-8c14-f343aee68305',
        display_category: 'light'
    },
    {
        name: '五色灯',
        serial_number: '9dcd7019-f266-4bc4-a3e9-5680e19abe4c',
        display_category: 'light'
    },
    {
        name: 'zigbee 门磁传感器',
        serial_number: 'e6ed1750-226b-4120-aeb7-89769e5b03aa',
        display_category: 'contactSensor'
    },
    {
        name: '窗帘',
        serial_number: '7453a012-14d3-4c69-8d7d-23c84a5f7d59',
        display_category: 'curtain'
    },
    {
        name: '温湿度传感器（正常）',
        serial_number: 'a93d959c-8cc3-4498-a33b-1d6084901165',
        display_category: 'temperatureAndHumiditySensor'
    },
    {
        name: 'plug',
        serial_number: '00124b002342d5a7',
        display_category: 'plug'
    },
    {
        name: '四开关',
        serial_number: 'acc74832-44b6-4e3a-8031-a3c6e42bfa6e',
        display_category: 'switch'
    },
    {
        name: 'waterLeakDetector',
        serial_number: '077efeb7-47aa-472d-8ca7-bc1f99674623',
        display_category: 'waterLeakDetector'
    },
    {
        name: 'curtain',
        serial_number: '7e8c4a1e-3e8c-49e7-a1ba-3dbe73f7bff4',
        display_category: 'button'
    }
];
export const useDeviceStore = defineStore({
    id: 'device',
    state(): deviceStoreState {
        return {
            deviceList: []
            // deviceList: deviceList.map((item) => ({ ...item, checked: true }))
        };
    },
    actions: {
        // 更新设备勾选状态
        updateDevicesListChecked(str: string, checked: boolean) {
            const index = this.deviceList.findIndex((v) => v.serial_number === str);
            this.deviceList[index].checked = checked;
        }
    },
    getters: {
        // 分类后的设备列表
        categoryDeviceList() {
            const res: categoryDeviceListItem[] = [];
            for (let categoryName of categoryMap.keys()) {
                const categories = categoryMap.get(categoryName);
                const device = this.deviceList.filter((item) => categories?.includes(item.display_category));
                if (device.length === 0) continue;
                res.push({
                    categoryName,
                    device,
                    checked: device.every((v) => v.checked === true)
                });
            }
            return res;
        }
    }
});
