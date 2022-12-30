<template>
    <div class="settings">
        <span class="label">token*</span>
        <p class="help-block">{{ t('SETTINGS.GET_TOKEN_TIP') }}</p>
        <div class="img-wrapper">
            <img src="" alt="" />
        </div>
        <p class="help-block">{{ t('SETTINGS.STEP_1') }}</p>
        <p class="help-block">{{ t('SETTINGS.STEP_2') }}</p>
        <p class="help-block">TIPS</p>
        <ul class="help-block">
            <li>{{ t('SETTINGS.TIP_1') }}</li>
            <li>{{ t('SETTINGS.TIP_2') }}</li>
        </ul>
        <!-- 无效token提示 -->
        <InvalidToken v-if="token && isExpire" />
        <!-- iHost卡片区域 -->
        <div class="card-wrapper">
            <div class="card" v-for="(item, index) in iHostList" :key="index">
                <div class="card-body">
                    <h5 class="card-title">{{ item.name }}</h5>
                    <p class="card-text">IP: {{ item.ip }}</p>
                    <p class="card-text">MAC: {{ item.mac }}</p>
                    <button
                        :class="['btn', 'btn-sm', unableClickGetToken && !getTokenTxt[index].loading ? 'btn-secondary' : 'btn-primary']"
                        @click="handleGetToken(item.mac)"
                        :disabled="unableClickGetToken"
                    >
                        <span v-if="getTokenTxt[index].loading" class="spinner-border spinner-border-sm text-white"></span>
                        {{ getTokenTxt[index].txt }}
                    </button>
                </div>
            </div>
            <div class="card">
                <div :class="['card-body', 'searchIHost', unableClickGetToken ? 'not-allowed' : 'pointer']" @click="handleClickQueryIHostCard">
                    <img src="" alt="" class="search-icon" />
                    <span class="search-txt">{{ t('SETTINGS.QUERY_IHOST') }}</span>
                </div>
            </div>
        </div>
        <!-- 根据ip搜寻iHost -->
        <div class="link-iHost" v-if="!unableClickGetToken && showAddIHostModal">
            <div class="title">
                <span>iHost</span>
                <button type="button" class="btn-close" @click="closeAddIHostModal"></button>
            </div>
            <div class="input-group mb-3">
                <input type="text" class="form-control" v-model.trim="inputIP" :placeholder="t('SETTINGS.ADD_IHOST_PLACEHOLDER')" @input="handleLinkIHostInput" />
                <span :class="['input-group-text', !validIP ? 'not-allowed' : 'pointer']" @click="handleLink">Link</span>
            </div>
            <span class="error-tip" v-if="showIrregularFormatTip">{{ linkIHostErrorTip }}</span>
            <span class="error-tip" v-if="showFailLinkIpTip">* IP 连接失败</span>
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
import { useIHostStore, INTERVAL } from '@/stores/iHost';
import { storeToRefs } from 'pinia';
import { getPluginConfig, updatePluginConfig } from '@/utils/config';
import { formatSecondToMinute } from '@/utils/time';
import { getDevicesByAT } from '@/utils/device';
import { ipv4 } from '@/utils/regExp';
import InvalidToken from '@/components/InvalidToken.vue';
import { useDeviceStore } from '@/stores/device';

const { t } = useI18n();
const iHostStore = useIHostStore();
const deviceStore = useDeviceStore();
const { iHostList, token, isExpire, getTokenTime, getTokenMac, successGetTokenMac, enableDeviceLog } = storeToRefs(iHostStore);
const { deviceList } = storeToRefs(deviceStore);
// 进入配置页时更新信息
const initConfigInfo = async () => {
    const { platform = '', ip = '', mac = '', ihostName = '', at = '', enableDeviceLog: log = false, devices = [] } = await getPluginConfig();
    // 更新pinia的值
    if (ihostName && ip && mac) {
        iHostStore.updateIHostList(ihostName, ip, mac);
    }
    token.value = at;
    successGetTokenMac.value = mac;
    enableDeviceLog.value = log;
    deviceList.value = devices;
    // 第一次进入配置页时更新name和platform
    !platform && (await updatePluginConfig());
    if (token.value) {
        // 目的是为了检验token是否有效
        await getDevicesByAT();
        // token失效时开启iHost查询，token有效时展示出对应的iHost
        if (isExpire.value) {
            // iHostList.value = [];
            queryMdns();
        } else {
            iHostList.value = [{ name: ihostName, ip: ip, mac: mac }];
        }
    } else {
        // 无token时直接开启iHost查询
        queryMdns();
    }
    window.homebridge.hideSpinner();
};
//	发起mdns查询
const queryMdns = async () => {
    console.log('发起mdns查询');
    await window.homebridge.request('/queryMdns');
};
// 关闭mdns查询
const closeMdns = async () => {
    console.log('关闭mdns查询');
    await window.homebridge.request('/closeQuery');
};
// 距上次获取token过去的时间
const actualInterval = ref(Math.floor((Date.now() - getTokenTime.value) / 1000));
// 是否处于倒计时中
const isInCountDown = computed(() => actualInterval.value < INTERVAL);
// 判断token是否有效
const isTokenValid = computed(() => !!(token.value && !isExpire.value));
// 是否禁用获取token按钮
const unableClickGetToken = computed(() => {
    const condition_1 = !!getTokenMac.value && iHostList.value.some((v) => v.mac === getTokenMac.value);
    const condition_2 = token.value ? (isTokenValid.value || isInCountDown.value) : isInCountDown.value;
    return condition_1 && condition_2;
});
// 获取token按钮文案
const getTokenTxt = computed(() => {
    return iHostList.value.map((v) => {
        const txtConfig = { loading: false, txt: t('SETTINGS.GET_TOKEN') };
        if (!isTokenValid.value && v.mac === getTokenMac.value && isInCountDown.value) {
            txtConfig.loading = true;
            txtConfig.txt = countDownTxt.value;
        } else if (v.mac === successGetTokenMac.value) {
            txtConfig.txt = isTokenValid.value ? t('SETTINGS.ALREADY_GET_TOKEN') : t('SETTINGS.RE_GET_TOKEN');
        }
        return txtConfig;
    });
});
// 倒计时
const timer = ref<number>();
const initCount = isInCountDown.value ? INTERVAL - actualInterval.value : INTERVAL;
const count = ref(initCount);
const countDownTxt = computed(() => formatSecondToMinute(count.value));
const countDown = () => {
    console.log('轮询开启');
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
        getAccessToken(getTokenMac.value, getTokenIP.value);
    }, 1000);
};
// 点击获取token按钮
const getTokenIP = computed(() => iHostList.value.find((v) => v.mac === getTokenMac.value)?.ip ?? '');
const handleGetToken = (mac: string) => {
    getTokenTime.value = Date.now();
    getTokenMac.value = mac;
    countDown();
};
//	获取access_token
const getAccessToken = async (mac: string, ip: string) => {
    const { error, data } = await window.homebridge.request('/getAccessToken', ip);
    if (error === 0) {
        console.log('token ===>', data.token);
        token.value = data.token;
        isExpire.value = false;
        successGetTokenMac.value = mac;
        getTokenTime.value = 0;
        clearInterval(timer.value);
        count.value = INTERVAL;
        actualInterval.value = INTERVAL;
        await getDevicesByAT();
        await updatePluginConfig();
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
// 是否展示根据ip搜索iHost的模态框
const showAddIHostModal = ref(false);
const handleClickQueryIHostCard = () => {
    if (unableClickGetToken.value) return;
    showAddIHostModal.value = true;
};
const closeAddIHostModal = () => {
    showAddIHostModal.value = false;
    inputIP.value = '';
    showIrregularFormatTip.value = false;
    showFailLinkIpTip.value = false;
};
// 根据ip查找iHost
const inputIP = ref('');
const validIP = computed(() => inputIP.value && ipv4.test(inputIP.value));
// 展示ip不规范错误
const showIrregularFormatTip = ref(false);
// 展示ip连接ihost失败错误
const showFailLinkIpTip = ref(false);
// 错误提示
const linkIHostErrorTip = computed(() => {
    if (!inputIP.value) {
        return '* ip不能为空';
    } else if (!ipv4.test(inputIP.value)) {
        return '* 不符合ipv4';
    }
});
const handleLinkIHostInput = () => {
    showIrregularFormatTip.value = true;
    showFailLinkIpTip.value = false;
};
// click link
const handleLink = async () => {
    if (unableClickGetToken.value || !validIP.value) return;
    await closeMdns()
    // const res = await window.homebridge.request('/getDeviceByIp', inputIP.value);
    // console.log('handleLink ==>', res)
    const { error, data } = await window.homebridge.request('/getDeviceByIp', inputIP.value);
    console.log('click link', { error, data });
    showIrregularFormatTip.value = false;
    if (error === 0) {
        showFailLinkIpTip.value = false;
        iHostStore.addIHost(data);
    } else {
        showFailLinkIpTip.value = true;
    }
};
// 是否显示设备日志
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
    .img-wrapper {
        width: 100%;
        height: 100px;
        padding: 6px;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .card-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: 24px 0 0;
        padding: 0 10px;
        .card {
            width: calc(50% - 5px);
            margin-bottom: 16px;
            &-body {
                padding: 10px;
            }
            .btn {
                width: 100%;
                margin-top: 10px;
                .spinner-border {
                    margin-right: 6px;
                }
            }
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
        .title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
        }
        .error-tip {
            color: #c22727;
        }
    }
    .check-desc {
        display: block;
        margin-top: -8px;
        font-size: 12px;
    }
}
</style>
