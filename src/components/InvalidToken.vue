<template>
    <div class="invalid-token">
        <img class="invalid-icon" src="../assets/image/warning-icon.png" alt="" />
        <span class="invalid-txt">{{ t('SETTINGS.INVALID_TOKEN') }}</span>
    </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style lang="scss" scoped>
.invalid-token {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 10px;
    margin-top: 20px;
    background-color: #f2f2f2;
    color: #c22c2c;
    border-radius: 8px;
    .invalid-icon {
        width: 24px;
        height: 24px;
        margin-right: 8px;
    }
}
</style>
