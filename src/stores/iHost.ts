import { getDevicesByAT } from '@/utils';
import { defineStore } from 'pinia';

export interface iHostListItem {
    name: string;
    ip: string;
    mac: string;
}

interface iHostStoreState {
    iHostList: iHostListItem[];
    token: string;
    /** Whether the token is invalid */
    isExpire: boolean;
    /** Whether the ip is invalid */
    isIPInvalid: boolean;
    /** The time when the Get token button is clicked */
    getTokenTime: number;
    /** The iHost device mac that clicked the get token button */
    getTokenMac: string;
    /** Successfully obtained the iHost device mac of the token */
    successGetTokenMac: string;
    /** Whether to display device events in the log */
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
            isExpire: false,
            isIPInvalid: false,
            getTokenTime: 0,
            getTokenMac: '',
            successGetTokenMac: '',
            enableDeviceLog: true
        };
    },
    actions: {
        // Add iHost device
        async addIHost(iHost: iHostListItem[]) {
            for (const item of iHost) {
                const { ip, mac } = item;
                if (!ip) return;
                const index = this.iHostList.findIndex((item) => item.ip === ip || item.mac === mac);
                if (index === -1) {
                    this.iHostList.push(item);
                } else {
                    this.iHostList.splice(index, 1, item);
                    await getDevicesByAT();
                }
            }
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
