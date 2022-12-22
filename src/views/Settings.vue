<template>
    <div class="settings">
        <span class="label">token*</span>
        <p class="getTokenTip">{{ t('SETTINGS.GET_TOKEN_TIP') }}</p>
        <div class="img-wrapper">
            <img src="" alt="" />
        </div>
        <p class="step">{{ t('SETTINGS.STEP_1') }}</p>
        <p class="step">{{ t('SETTINGS.STEP_2') }}</p>
        <p class="step">TIPS</p>
        <ul class="tip">
            <li>{{ t('SETTINGS.TIP_1') }}</li>
            <li>{{ t('SETTINGS.TIP_2') }}</li>
        </ul>
        <!-- 无效token提示 -->
        <div class="invalid-warning">
            <img class="invalid-icon" src="" alt="" />
            <span class="invalid-txt">{{ t('SETTINGS.INVALID_TOKEN') }}</span>
        </div>
        <!-- iHost卡片区域 -->
        <div class="card-wrapper">
            <div class="card" v-for="(item, index) in iHostList" :key="index">
                <div class="card-body">
                    <h5 class="card-title">{{ item.name }}</h5>
                    <p class="card-text">IP: {{ item.ip }}</p>
                    <p class="card-text">MAC: {{ item.mac }}</p>
                    <button class="btn btn-primary btn-sm" @click="handleGetToken(item.mac, item.ip)" :disabled="unableClickGetToken">
                        {{ getTokenTxt[index] }}
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
        <div class="link-iHost" v-if="showAddIHostModal">
            <div class="title">
                <span>iHost</span>
                <button type="button" class="btn-close" @click="closeAddIHostModal"></button>
            </div>
            <div class="input-group mb-3">
                <input type="text" class="form-control" v-model="inputIP" :placeholder="t('SETTINGS.ADD_IHOST_PLACEHOLDER')" />
                <span :class="['input-group-text', unableClickGetToken ? 'not-allowed' : 'pointer']" @click="handleLink">Link</span>
            </div>
        </div>
        <!-- log -->
        <span class="label">Log Config</span>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
            <label class="form-check-label" for="flexCheckDefault">
                <span class="step">{{ t('SETTINGS.LOG_FEAT') }}</span>
            </label>
        </div>
        <span class="check-desc">{{ t('SETTINGS.LOG_DESC') }}</span>
    </div>
</template>

<script lang="ts" setup>
import { ref } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';
import { useIHostStore } from '@/stores/iHost';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { formatSecondToMinute } from '@/utils/time';

const { t } = useI18n();
const iHostStore = useIHostStore();
const { iHostList, token, interval, getTokenTime, getTokenIP, getTokenMac, successGetTokenIP, successGetTokenMac } = storeToRefs(iHostStore);
// 距上次获取token过去的时间
const actualInterval = ref(Math.floor((Date.now() - getTokenTime.value) / 1000));
// 是否处于倒计时中
const isInCountDown = computed(() => actualInterval.value < interval.value);
// 是否禁用获取token按钮
const unableClickGetToken = ref(actualInterval.value < interval.value);
// 获取token按钮文案
const getTokenTxt = computed(() => {
    return iHostList.value.map((v) => {
        if (v.mac === successGetTokenMac.value) {
            return t('SETTINGS.ALREADY_GET_TOKEN');
        } else if (v.mac === getTokenMac.value && isInCountDown.value) {
            return countDownTxt.value;
        }
        return t('SETTINGS.GET_TOKEN');
    });
});
// 倒计时
const timer = ref<number>();
const initCount = isInCountDown.value ? interval.value - actualInterval.value : interval.value;
const count = ref(initCount);
const countDownTxt = computed(() => formatSecondToMinute(count.value));
const countDown = (callback = () => {}) => {
    timer.value = setInterval(() => {
        if (count.value === 0) {
            unableClickGetToken.value = false;
            clearInterval(timer.value);
            count.value = interval.value;
            return;
        }
        count.value--;
        actualInterval.value = Math.floor((Date.now() - getTokenTime.value) / 1000);
        callback();
    }, 1000);
};
// 点击获取token按钮
const handleGetToken = (mac: string, ip: string) => {
    unableClickGetToken.value = true;
    getTokenTime.value = Date.now();
    getTokenMac.value = mac;
    getTokenIP.value = ip;
    countDown(() => {
        getAccessToken(mac, ip);
    });
};
//	获取access_token
const getAccessToken = async (mac: string, ip: string) => {
    const { error, data } = await window.homebridge.request('/getAccessToken', ip);
    if (error === 0) {
        console.log('accessToken', data.token);
        token.value = data.token;
        clearInterval(timer.value);
        unableClickGetToken.value = true;
        successGetTokenIP.value = ip;
        successGetTokenMac.value = mac;
    }
};
onMounted(() => {
    const index = iHostList.value.findIndex((v) => v.mac === getTokenMac.value);
    if (index !== -1 && isInCountDown.value) {
        countDown();
    }
});
// 是否展示根据ip搜索iHost的模态框
const showAddIHostModal = ref(false);
const handleClickQueryIHostCard = () => {
    if (unableClickGetToken.value) return;
    showAddIHostModal.value = true;
};
const closeAddIHostModal = () => (showAddIHostModal.value = false);
// 根据ip查找iHost
const inputIP = ref('');
const handleLink = async () => {
    if (unableClickGetToken.value || !inputIP.value) return;
    const res = await window.homebridge.request('/getDeviceByIp', inputIP.value);
    iHostStore.addIHost(res);
};
</script>

<style lang="scss" scoped>
.settings {
    .label {
        color: #333;
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
    .step {
        color: #555;
    }
    .invalid-warning {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 10px;
        background-color: #f2f2f2;
        color: #c22c2c;
        border-radius: 8px;
        .invalid-icon {
            width: 24px;
            height: 24px;
            margin-right: 8px;
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
    }
    .check-desc {
        display: block;
        margin-top: -8px;
        font-size: 12px;
    }
}
</style>
