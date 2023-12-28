<template>
    <div class="devices-list-wrapper">
        <!-- Show when there is no token -->
        <div class="unable-get-device title" v-if="!token">{{ t('DEVICES.UNABLE_GET_DEVICE') }}</div>
        <div v-else>
            <!-- token invalidation -->
            <InvalidToken v-if="isExpire || isIPInvalid" style="margin-bottom: 10px" />
            <!-- Displayed when there is token but no device -->
            <div class="no-device title" v-if="(!isExpire || !isIPInvalid) && !deviceList.length">
                <img src="../assets/image/no-device.png" alt="" />
                <p>{{ t('DEVICES.NO_DEVICE') }}</p>
            </div>
            <!-- Displayed when there are tokens and devices -->
            <div class="device-wrapper" v-if="deviceList.length">
                <p class="title">{{ t('DEVICES.CONFIG') }}</p>
                <p class="tip help-block">{{ t('DEVICES.TIP') }}</p>
                <div class="device-list">
                    <!-- Device category -->
                    <div class="form-check" v-for="(item, index) in categoryDeviceList" :key="index">
                        <!-- fold icon -->
                        <a class="collapse-icon help-block" data-bs-toggle="collapse" :href="'#' + item.categoryName" @click="collapse(index)">
                            <img :src="imgArr[index]" alt="" />
                        </a>
                        <input
                            class="form-check-input"
                            type="checkbox"
                            @change="handleTotalChange(item.device, $event)"
                            :checked="item.checked"
                            :disabled="(!!token && (isExpire || isIPInvalid)) || !item.support"
                        />
                        <label class="form-check-label categoryName" :style="{ marginBottom: '8px' }">{{ item.categoryName }}</label>
                        <!-- Prompt not supported -->
                        <!-- Specific device under the category -->
                        <div class="collapse show" :id="item.categoryName" v-for="item1 in item.device" :key="item1.serial_number">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                :checked="item1.checked"
                                @change="handleSingleChange(item1.serial_number, $event)"
                                :disabled="(!!token && (isExpire || isIPInvalid)) || !item.support"
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
import { updatePluginConfig } from '@/utils';
import InvalidToken from '@/components/InvalidToken.vue';
import expendSrc from '@/assets/image/expend.png';
import collapseSrc from '@/assets/image/collapse.png';

const { t } = useI18n();

const { token, isExpire, isIPInvalid } = storeToRefs(useIHostStore());
const deviceStore = useDeviceStore();
const { deviceList, categoryDeviceList } = storeToRefs(deviceStore);
// fold icon
const imgArr = ref(new Array(categoryMap.size).fill(expendSrc));
const collapse = (index: number) => {
    imgArr.value[index] = imgArr.value[index] === expendSrc ? collapseSrc : expendSrc;
};
// Notice! ! !
// Any modification related to config needs to call the updatePluginConfig method first, so that the config can be written to the disk correctly when you click save
// Check the device category
const handleTotalChange = (device: deviceListItem[], e: any) => {
    const checked = e.target.checked;
    device.forEach((item) => deviceStore.updateDevicesListChecked(item.serial_number, checked));
    updatePluginConfig();
};
// Check the specific device
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
            color: #ffc300;
            border: 1px solid #ffc300;
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
