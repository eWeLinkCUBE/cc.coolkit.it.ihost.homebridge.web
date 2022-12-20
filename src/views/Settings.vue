<template>
    <div class="settings">
        <span class="label">token*</span>
        <p class="getTokenTip">{{ t('GET_TOKEN_TIP') }}</p>
        <div class="img-wrapper">
            <img src="" alt="">
        </div>
        <p class="step">{{ t('STEP_1') }}</p>
        <p class="step">{{ t('STEP_2') }}</p>
        <p class="step">TIPS</p>
        <ul class="tip">
            <li>{{ t('TIP_1') }}</li>
            <li>{{ t('TIP_2') }}</li>
        </ul>
        <!-- 无效token提示 -->
        <div class="invalid-warning">
            <img class="invalid-icon" src="" alt="">
            <span class="invalid-txt">{{ t('INVALID_TOKEN') }}</span>
        </div>
        <!-- iHost卡片区域 -->
        <div class="card-wrapper">
            <div class="card" v-for="(item, index) in iHostList" :key="index">
                <div class="card-body">
                    <h5 class="card-title">iHost</h5>
                    <p class="card-text">IP: {{ item.ip }}</p>
                    <p class="card-text">MAC: {{ item.mac }}</p>
                    <a href="#" class="btn btn-primary btn-sm">{{ t('GET_TOKEN') }}</a>
                </div>
            </div>
            <div class="card">
                <div class="card-body searchIHost" @click="handleClickQueryIHostCard">
                    <img src="" alt="" class="search-icon">
                    <span class="search-txt">{{ t('QUERY_IHOST') }}</span>
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
                <input type="text" class="form-control" :placeholder="t('ADD_IHOST_PLACEHOLDER')" />
                <span class="input-group-text">Link</span>
            </div>
        </div>
        <!-- log -->
        <span class="label">Log Config</span>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
            <label class="form-check-label" for="flexCheckDefault">
                <span class="step">{{ t('LOG_FEAT') }}</span>
            </label>
        </div>
        <span class="check-desc">{{ t('LOG_DESC') }}</span>
    </div>
</template>

<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const iHostList = [
    { name: 'iHost', ip: '192.168.1.1', mac: '********' },
    { name: 'iHost', ip: '192.168.1.1', mac: '********' },
    { name: 'iHost', ip: '192.168.1.1', mac: '********' }
]
const showAddIHostModal = ref(false)
const handleClickQueryIHostCard = () => showAddIHostModal.value = true
const closeAddIHostModal = () => showAddIHostModal.value = false
</script>

<style lang="scss" scoped>
.settings {
    padding: 6px 4px;
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
            cursor: pointer;
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
        .input-group-text {
            cursor: pointer;
        }
    }
    .check-desc {
        display: block;
        margin-top: -8px;
        font-size: 12px;
    }
}
</style>
