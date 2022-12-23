import { defineStore } from 'pinia';

export interface iHostListItem {
    name: string;
    ip: string;
    mac: string;
}
interface iHostStoreState {
    iHostList: iHostListItem[];
    token: string;
    isExpire: boolean;
    getTokenTime: number;
    getTokenMac: string;
    successGetTokenMac: string;
    interval: number;
    enableDeviceLog: boolean;
}
const iHostList = [
    { name: 'iHost', ip: '192.168.2.25', mac: '111111' },
    { name: 'iHost', ip: '192.168.2.25', mac: '222222' },
    { name: 'iHost', ip: '192.168.2.25', mac: '333333' }
];
export const useIHostStore = defineStore({
    id: 'iHost',
    state(): iHostStoreState {
        return {
            iHostList: iHostList,
            token: '',
            isExpire: false, // token是否失效
            getTokenTime: 0, // 点击获取token按钮的时间
            getTokenMac: '', // 点击了获取token按钮的iHost设备mac
            successGetTokenMac: '', // 成功获取到token的iHost设备MAC
            interval: 10, // 间隔时间
            enableDeviceLog: false // 是否在日志中显示设备事件
        };
    },
    actions: {
        // 添加iHost设备
        addIHost(iHost: iHostListItem[]) {
            iHost.forEach((iHostItem) => {
                const index = this.iHostList.findIndex((item) => item.ip === iHostItem.ip || item.mac === iHostItem.mac);
                if (index === -1) {
                    this.iHostList.push(iHostItem);
                }
            });
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
                paths: ['token', 'isExpire', 'getTokenTime', 'getTokenMac', 'successGetTokenMac']
            }
        ]
    }
});
