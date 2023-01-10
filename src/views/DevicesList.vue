<template>
    <div class="devices-list-wrapper">
        <!-- 无token时展示 -->
        <div class="unable-get-device title" v-if="!token">{{ t('DEVICES.UNABLE_GET_DEVICE') }}</div>
        <div v-else>
            <!-- token失效 -->
            <InvalidToken v-if="isExpire" style="margin-bottom: 10px" />
            <!-- 有token无设备时展示 -->
            <div class="no-device title" v-if="!isExpire && !deviceList.length">
                <img src="../assets/image/no-device.png" alt="" />
                <p>{{ t('DEVICES.NO_DEVICE') }}</p>
            </div>
            <!-- 有token有设备时展示 -->
            <div class="device-wrapper" v-if="deviceList.length">
                <p class="title">{{ t('DEVICES.CONFIG') }}</p>
                <p class="tip help-block">{{ t('DEVICES.TIP') }}</p>
                <div class="device-list">
                    <!-- 设备类别 -->
                    <div class="form-check" v-for="(item, index) in categoryDeviceList" :key="index">
                        <!-- 折叠图标 -->
                        <a class="collapse-icon help-block" data-bs-toggle="collapse" :href="'#' + item.categoryName" @click="collapse(index)">
                            <img :src="imgArr[index]" alt="" />
                        </a>
                        <input class="form-check-input" type="checkbox" @change="handleTotalChange(item.device, $event)" :checked="item.checked" :disabled="!!token && isExpire || !item.support" />
                        <label class="form-check-label categoryName" :style="{ marginBottom: item.support ? '8px' : '20px' }">{{ item.categoryName }}</label>
                        <!-- 暂不支持提示 -->
                        <span v-if="!item.support" class="temp-not-support help-block">
                            <!-- <img src="" alt=""> -->
                            <span class="not-support-icon">i</span>
                            {{ t('DEVICES.TEMP_NOT_SUPPORT') }}
                        </span>
                        <!-- 类别下的具体设备 -->
                        <div class="collapse show" :id="item.categoryName" v-for="item1 in item.device" :key="item1.serial_number">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                :checked="item1.checked"
                                @change="handleSingleChange(item1.serial_number, $event)"
                                :disabled="!!token && isExpire || !item.support"
                            />
                            <label class="form-check-label">{{ item1.name }}</label>
                            <p class="deviceid help-block">ID: {{ item1.serial_number }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useIHostStore } from '@/stores/iHost';
import { useDeviceStore, type deviceListItem, categoryMap } from '@/stores/device';
import { updatePluginConfig } from '@/utils/config';
import InvalidToken from '@/components/InvalidToken.vue';
import expendSrc from '@/assets/image/expend.png';
import collapseSrc from '@/assets/image/collapse.png';

const { t } = useI18n();

const { token, isExpire } = storeToRefs(useIHostStore());
const deviceStore = useDeviceStore();
const { deviceList, categoryDeviceList } = storeToRefs(deviceStore);
// 折叠图标
const imgArr = ref(new Array(categoryMap.size).fill(expendSrc));
const collapse = (index: number) => {
    imgArr.value[index] = imgArr.value[index] === expendSrc ? collapseSrc : expendSrc;
};
// 注意！！！
// 任何有关于config的修改，都需要先调用updatePluginConfig方法，这样在点击保存时，才能正确将config写入磁盘
// 勾选设备类别
const handleTotalChange = (device: deviceListItem[], e: any) => {
    const checked = e.target.checked;
    device.forEach((item) => deviceStore.updateDevicesListChecked(item.serial_number, checked));
    updatePluginConfig();
};
// 勾选具体设备
const handleSingleChange = (v: string, e: any) => {
    const checked = e.target.checked;
    deviceStore.updateDevicesListChecked(v, checked);
    updatePluginConfig();
};
</script>

<style lang="scss" scoped>
.title {
    font-weight: 600;
}
.no-device {
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
        width: 190px;
        height: 190px;
    }
}
.device-wrapper {
    .tip {
        margin: 6px 0;
    }
}
.form-check {
    position: relative;
    margin-bottom: 20px;
    .collapse-icon {
        position: absolute;
        right: 0;
        top: -2px;
        img {
            width: 16px;
            height: 16px;
        }
    }
    .categoryName {
        margin-top: -4px;
        font-size: 18px;
    }
    .temp-not-support {
        position: absolute;
        left: 17px;
        top: 20px;
        display: flex;
        align-items: center;
        font-size: 10px;
        // img {
        //     width: 10px;
        //     height: 10px;
        //     margin-right: 2px;
        //     background-color: #FFC300;
        // }
        .not-support-icon {
            width: 20px;
            height: 20px;
            font-size: 14px;
            color: #FFC300;
            border: 1px solid #FFC300;
            border-radius: 50%;
            text-align: center;
            transform: scale(0.6);
        }
    }
    .collapse {
        margin-bottom: 8px;
        .deviceid {
            font-size: 12px;
        }
    }
}
.form-check:last-child {
    margin-bottom: 0;
}
</style>
