<template>
    <div class="settings">
        <span class="label">token*</span>
        <p class="help-block">{{ t('SETTINGS.GET_TOKEN_TIP') }}</p>
        <!-- token tutorial -->
        <TokenTutorial />
        <!-- Invalid token prompt -->
        <InvalidToken v-if="token && (isExpire || isIPInvalid)" />
        <!-- iHost card area -->
        <div class="card-wrapper">
            <div class="card" v-for="(item, index) in iHostList" :key="index">
                <div class="card-body">
                    <h5 class="card-title">{{ item.name }}</h5>
                    <p class="card-text ellipsis">IP: {{ item.name.includes('NSPanelPro') ? item.ip.replace(':8081', '') : item.ip }}</p>
                    <p class="card-text ellipsis">MAC: {{ item.mac }}</p>
                    <button
                        :class="['btn', 'btn-sm', unableClickGetToken && !getTokenTxt[index].loading ? 'btn-secondary' : 'btn-primary']"
                        @click="handleGetToken(item.mac)"
                        :disabled="unableClickGetToken"
                    >
                        <span v-if="getTokenTxt[index].loading" class="spinner-border spinner-border-sm text-white"></span>
                        <img v-else-if="getTokenTxt[index].again" src="../assets/image/reget-icon.png" alt="" class="reget-icon" />
                        {{ getTokenTxt[index].txt }}
                    </button>
                </div>
            </div>
            <div :class="['card', unableClickGetToken && !isIPInvalid ? 'not-allowed grey-card' : 'pointer']">
                <div class="card-body searchIHost" @click="handleClickQueryIHostCard">
                    <img src="../assets/image/search.png" alt="" class="search-icon" />
                    <span class="search-txt">{{ t('SETTINGS.QUERY_IHOST') }}</span>
                </div>
            </div>
        </div>
        <!-- Search iHost by ip -->
        <div class="link-iHost" v-if="(!unableClickGetToken || isIPInvalid) && showAddIHostModal">
            <div class="title">
                <span>iHost IP</span>
                <div @click="closeAddIHostModal" style="cursor: pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path
                            d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
                        />
                    </svg>
                </div>
            </div>
            <div class="input-group mb-3 link-iHost-input">
                <input type="text" class="form-control" v-model.trim="inputIP" :placeholder="t('SETTINGS.ADD_IHOST_PLACEHOLDER')" @input="handleLinkIHostInput" />
                <span :class="['input-group-text', !validIP ? 'not-allowed' : 'pointer']" @click="handleLink">
                    <span v-if="loadingLink" class="spinner-border spinner-border-sm text-white"></span>
                    <span v-else>Link</span>
                </span>
            </div>
            <span class="error-tip" v-if="showIrregularFormatTip">{{ linkIHostErrorTip }}</span>
            <span class="error-tip" v-else-if="showFailLinkIpTip">{{ t('SETTINGS.LINK_FAILED') }}</span>
        </div>
        <!-- log -->
        <span class="label">Log Config</span>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" :checked="enableDeviceLog" @change="handleChange" />
            <label class="form-check-label">
                <span class="step">{{ t('SETTINGS.LOG_FEAT') }}</span>
            </label>
        </div>
        <span class="check-desc help-block">{{ t('SETTINGS.LOG_DESC') }}</span>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from '@vue/runtime-core';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useIHostStore, INTERVAL } from '@/stores/iHost';
import { useDeviceStore } from '@/stores/device';
import { getPluginConfig, updatePluginConfig, getDevicesByAT, formatSecondToMinute, ipv4 } from '@/utils';
import InvalidToken from '@/components/InvalidToken.vue';
import TokenTutorial from '@/components/TokenTutorial.vue';

const { t } = useI18n();
const iHostStore = useIHostStore();
const deviceStore = useDeviceStore();
const { iHostList, token, isExpire, isIPInvalid, getTokenTime, getTokenMac, successGetTokenMac, enableDeviceLog } = storeToRefs(iHostStore);
const { deviceList } = storeToRefs(deviceStore);

interface IGetDeviceByIp {
    ip: string;
    mac: string;
    domain: string;
}

// Update information when entering the configuration page
const initConfigInfo = async () => {
    const { platform = '', ihost = {}, enableDeviceLog: log = true } = await getPluginConfig();
    const { ip = '', mac = '', ihostName = '', at = '', devices = [] } = ihost;
    // Update the value of pinia
    if (ihostName && ip && mac) {
        iHostStore.updateIHostList(ihostName, ip, mac);
    }

    token.value = at;
    successGetTokenMac.value = mac;
    enableDeviceLog.value = log;
    deviceList.value = devices;

    if (!platform) {
        // Update name and platform when entering the configuration page for the first time
        await updatePluginConfig();
    }

    if (token.value) {
        // The purpose is to check whether the token is valid
        await getDevicesByAT();
        // Open the iHost query when the token is invalid, and display the corresponding iHost when the token is valid
        if (isExpire.value || isIPInvalid.value) {
            queryMdns();
        } else {
            iHostList.value = [{ name: ihostName, ip: ip, mac: mac }];
        }
    } else {
        // Clear the ihost list when it is not counting down
        !isInCountDown.value && (iHostList.value = []);
        // Open iHost query directly when there is no token
        queryMdns();
    }
    window.homebridge.hideSpinner();
};
//	Initiate mdns query
const queryMdns = async () => {
    await window.homebridge.request('/queryMdns');
};
// close mdns lookup
const closeMdns = async () => {
    await window.homebridge.request('/closeQuery');
};
/** The elapsed time since the last time the token was obtained */
const actualInterval = ref(Math.floor((Date.now() - getTokenTime.value) / 1000));

/** Is it in the countdown */
const isInCountDown = computed(() => actualInterval.value < INTERVAL);

/** Determine whether the token is valid */
const isTokenValid = computed(() => !!(token.value && !isExpire.value));

/** Whether to disable the get token button */
const unableClickGetToken = computed(() => {
    // mac exist
    const condition_1 = !!getTokenMac.value && iHostList.value.some((v) => v.mac === getTokenMac.value);
    // token exist and countdown not functioning
    const condition_2 = token.value ? isTokenValid.value || isInCountDown.value : isInCountDown.value;
    return condition_1 && condition_2;
});

/** Get token button copy */
const getTokenTxt = computed(() => {
    return iHostList.value.map((v) => {
        const txtConfig = { loading: false, again: false, txt: t('SETTINGS.GET_TOKEN') };
        if (!isTokenValid.value && v.mac === getTokenMac.value && isInCountDown.value) {
            txtConfig.loading = true;
            txtConfig.txt = countDownTxt.value;
        } else if (v.mac === successGetTokenMac.value) {
            if (isIPInvalid.value) {
                txtConfig.txt = t('SETTINGS.IP_UNABLE_TO_ACCESS');
            } else if (isTokenValid.value) {
                txtConfig.txt = t('SETTINGS.ALREADY_GET_TOKEN');
            } else {
                txtConfig.again = true;
                txtConfig.txt = t('SETTINGS.RE_GET_TOKEN');
            }
        }
        return txtConfig;
    });
});

// countdown
const timer = ref<number>();
const initCount = isInCountDown.value ? INTERVAL - actualInterval.value : INTERVAL;
const count = ref(initCount);
const countDownTxt = computed(() => formatSecondToMinute(count.value));

const countDown = () => {
    actualInterval.value = Math.floor((Date.now() - getTokenTime.value) / 1000);
    closeMdns();
    timer.value = setInterval(() => {
        if (count.value === 0) {
            clearInterval(timer.value);
            count.value = INTERVAL;
            queryMdns();
            return;
        }
        count.value--;
        actualInterval.value = Math.floor((Date.now() - getTokenTime.value) / 1000);
        count.value === 0 && (actualInterval.value = INTERVAL);
        getAccessToken(getTokenMac.value);
    }, 1000);
};

// Click the get token button
const handleGetToken = (mac: string) => {
    getTokenTime.value = Date.now();
    getTokenMac.value = mac;
    countDown();
};

//	get access_token
const getAccessToken = async (mac: string) => {
    const ip = iHostList.value.find((v) => v.mac === getTokenMac.value)?.ip ?? '';
    const { error, data } = await window.homebridge.request('/getAccessToken', ip);
    if (error === 0) {
        token.value = data.token;
        isExpire.value = false;
        isIPInvalid.value = false;
        successGetTokenMac.value = mac;
        getTokenTime.value = 0;
        clearInterval(timer.value);
        count.value = INTERVAL;
        actualInterval.value = INTERVAL;
        await getDevicesByAT();
    }
};

onMounted(async () => {
    await initConfigInfo();
    if (isTokenValid.value) return;
    const index = iHostList.value.findIndex((v) => v.mac === getTokenMac.value);
    if (index !== -1 && isInCountDown.value) {
        countDown();
    }
});
onUnmounted(() => {
    clearInterval(timer.value);
});

// Whether to display the modal box for searching iHost based on ip
const showAddIHostModal = ref(false);
const handleClickQueryIHostCard = () => {
    if (unableClickGetToken.value && !isIPInvalid.value) return;
    showAddIHostModal.value = true;
};
const closeAddIHostModal = () => {
    showAddIHostModal.value = false;
    inputIP.value = '';
    showIrregularFormatTip.value = false;
    showFailLinkIpTip.value = false;
};

// Find iHost based on ip
const inputIP = ref('');
const loadingLink = ref(false);
const validIP = computed(() => inputIP.value && ipv4.test(inputIP.value) && !iHostList.value.some((v) => v.ip === inputIP.value));
// Show ip irregularity error
const showIrregularFormatTip = ref(false);
// Display ip connection ihost failed error
const showFailLinkIpTip = ref(false);
// Error message
const linkIHostErrorTip = computed(() => {
    if (!inputIP.value) {
        return t('SETTINGS.INPUT_NULL');
    } else if (!ipv4.test(inputIP.value)) {
        return t('SETTINGS.NOT_MATCH_IPV4');
    } else if (iHostList.value.some((v) => v.ip === inputIP.value)) {
        return t('SETTINGS.EXISTED_IP');
    }
});

const handleLinkIHostInput = () => {
    showIrregularFormatTip.value = true;
    showFailLinkIpTip.value = false;
};

// click link
const handleLink = async () => {
    if ((unableClickGetToken.value && !isIPInvalid.value) || !validIP.value || loadingLink.value) return;
    loadingLink.value = true;
    await closeMdns();

    const [NSPanelProRes, iHostRes] = await Promise.all([
        window.homebridge.request('/getDeviceByIp', `${inputIP.value}:8081`),
        window.homebridge.request('/getDeviceByIp', inputIP.value),
    ]);


    let result: null | IGetDeviceByIp = null;
    let actualIP = inputIP.value;
    if (NSPanelProRes.error === 0) {
        result = NSPanelProRes.data;
        actualIP = `${actualIP}:8081`;
    }

    if (iHostRes.error === 0) {
        result = iHostRes.data;
    }

    showIrregularFormatTip.value = false;
    if (result) {
        let isExist = false;
        iHostList.value.forEach((item) => {
            if (item.mac === result!.mac) {
                isExist = true;
                item.ip = actualIP;
                item.name = result!.domain;
            }
        });

        if (isExist) {
            isExpire.value = false;
            isIPInvalid.value = false;
            await getDevicesByAT();
        } else {
            const item = {
                ip: actualIP,
                mac: result.mac,
                name: result.domain,
            };
            iHostStore.addIHost([item]);
        }

        closeAddIHostModal();
    } else {
        showFailLinkIpTip.value = true;
        queryMdns();
    }
    loadingLink.value = false;
};
// Whether to display device logs
const handleChange = (e: any) => {
    enableDeviceLog.value = e.target.checked;
    updatePluginConfig();
};
</script>

<style lang="scss" scoped>
.settings {
    .label {
        font-weight: 600;
    }

    .card-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 24px 0 0;
        padding: 0 10px;
        .card {
            width: calc(50% - 5px);
            height: 145px;
            margin-bottom: 16px;
            border: none !important;
            &-body {
                padding: 10px;
            }
            .btn {
                width: 100%;
                margin-top: 10px;
                .spinner-border {
                    margin-right: 6px;
                }
                .reget-icon {
                    width: 18px;
                    height: 18px;
                }
            }
        }
        .grey-card {
            filter: grayscale(100%);
            background: #e8e8ec;
            color: #9e9e9e;
        }
        .searchIHost {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .search-icon {
                width: 50px;
                height: 50px;
                margin-bottom: 10px;
            }
        }
    }
    .link-iHost {
        margin: 0 10px 16px;
        padding: 10px;
        border: 1px solid #8f8f8f;
        border-radius: 2px 2px 2px 2px;
        .title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
        }
        .link-iHost-input {
            margin-bottom: 4px !important;
        }
        .input-group-text {
            display: flex;
            justify-content: center;
            width: 54px;
            border-radius: 0 0.25rem 0.25rem 0;
        }
        .error-tip {
            color: #c22727;
        }
    }
    .check-desc {
        display: block;
        margin-top: -8px;
        font-size: 12px;
        line-height: 33px;
    }
}
</style>
