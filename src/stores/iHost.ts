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
    isVerify: boolean;
    getTokenTime: number;
    getTokenMac: string;
    successGetTokenMac: string;
    enableDeviceLog: boolean;
}

// 间隔时间（秒）
export const INTERVAL = 5 * 60;

const iHostList = [
    { name: 'iHost', ip: '192.168.2.25', mac: '111111' },
    { name: 'iHost', ip: '192.168.2.25', mac: '222222' },
    { name: 'iHost', ip: '192.168.2.25', mac: '333333' }
];

export const useIHostStore = defineStore({
    id: 'iHost',
    state(): iHostStoreState {
        return {
            iHostList: [],
            token: '',
            isExpire: true, // token是否失效
            isVerify: false, // 是否验证过token的有效性
            getTokenTime: 0, // 点击获取token按钮的时间
            getTokenMac: '', // 点击了获取token按钮的iHost设备mac
            successGetTokenMac: '', // 成功获取到token的iHost设备MAC
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
        },
        // 筛选出获取过token并且token当前可用的iHost
        getCurrentIHost() {
            const data = this.iHostList.find((v) => v.mac === this.successGetTokenMac) as iHostListItem;
            this.iHostList = [data];
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
                paths: ['iHostList', 'token', 'isExpire', 'getTokenTime', 'getTokenMac', 'successGetTokenMac']
            }
        ]
    }
});
