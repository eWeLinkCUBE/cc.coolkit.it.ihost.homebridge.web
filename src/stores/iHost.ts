import { defineStore } from 'pinia'

interface iHostListItem {
    name: string
    ip: string
    mac: string
}
interface iHostStoreState {
    iHostList: iHostListItem[]
    getTokenTime: number
    token: string
    interval: number
}
const iHostList = [
    { name: 'iHost', ip: '192.168.1.1', mac: '111111' },
    { name: 'iHost', ip: '192.168.1.1', mac: '222222' },
    { name: 'iHost', ip: '192.168.1.1', mac: '333333' }
]
export const useIHostStore = defineStore({
    id: 'iHost',
    state(): iHostStoreState {
        return {
            iHostList: iHostList,
            token: '123',
            getTokenTime: 0,
            interval: 5 * 60 * 1000
        }
    },
    actions: {
        addIHost (iHostItem: iHostListItem) {
            const index = this.iHostList.findIndex(item => item.mac === iHostItem.mac)
            if (index === -1) {
                this.iHostList.push(iHostItem)
            }
        }
    }
})