import { defineStore } from 'pinia';

interface iHostListItem {
    name: string;
    ip: string;
    mac: string;
}
interface iHostStoreState {
    iHostList: iHostListItem[];
    getTokenTime: number;
    getTokenIP: string;
    getTokenMac: string;
    successGetTokenIP: string;
    successGetTokenMac: string;
    token: string;
    interval: number;
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
            getTokenTime: 0, // 点击获取token按钮的时间
            getTokenIP: '', // 执行了获取token操作的iHost设备IP
            getTokenMac: '', // 执行了获取token操作的iHost设备MAC
            successGetTokenIP: '', // 成功获取token的iHost设备IP
            successGetTokenMac: '', // 成功获取token的iHost设备MAC
            interval: 10 // 间隔时间
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
                paths: ['token', 'getTokenTime', 'getTokenIP', 'getTokenMac', 'successGetTokenIP', 'successGetTokenMac']
            }
        ]
    }
});
