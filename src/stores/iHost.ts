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

// Interval time (seconds)
export const INTERVAL = 5 * 60;

export const useIHostStore = defineStore({
    id: 'iHost',
    state(): iHostStoreState {
        return {
            iHostList: [],
            token: '',
            isExpire: false, // Whether the token is invalid
            getTokenTime: 0, // The time when the Get token button is clicked
            getTokenMac: '', // The iHost device mac that clicked the get token button
            successGetTokenMac: '', // Successfully obtained the iHost device mac of the token
            enableDeviceLog: true // Whether to display device events in the log
        };
    },
    actions: {
        // Add iHost device
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
        // Update iHost listing data
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
