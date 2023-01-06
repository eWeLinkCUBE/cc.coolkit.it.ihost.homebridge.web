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
    enableDeviceLog: boolean;
}

// 间隔时间（秒）
export const INTERVAL = 5 * 60;

export const useIHostStore = defineStore({
    id: 'iHost',
    state(): iHostStoreState {
        return {
            iHostList: [],
            token: '',
            isExpire: false, // token是否失效
            getTokenTime: 0, // 点击获取token按钮的时间
            getTokenMac: '', // 点击了获取token按钮的iHost设备mac
            successGetTokenMac: '', // 成功获取到token的iHost设备MAC
            enableDeviceLog: true // 是否在日志中显示设备事件
        };
    },
    actions: {
        // 添加iHost设备
        addIHost(iHost: iHostListItem[]) {
            iHost.forEach((iHostItem) => {
                const { ip, mac } = iHostItem;
                if (!ip) return;
                const index = this.iHostList.findIndex((item) => item.ip === ip || item.mac === mac);
                if (index === -1) {
                    this.iHostList.push(iHostItem);
                } else {
                    this.iHostList.splice(index, 1, iHostItem);
                }
            });
        },
        // 更新iHost列表数据
        updateIHostList(name: string, ip: string, mac: string) {
            const index = this.iHostList.findIndex((item) => item.mac === mac);
            if (index !== -1) {
                this.iHostList.splice(index, 1, { name, ip, mac });
            }
        }
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
                paths: ['iHostList', 'token', 'getTokenTime', 'getTokenMac', 'successGetTokenMac']
            }
        ]
    }
});
