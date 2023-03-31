<template>
    <div id="tutorial-carousel" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">
            <div class="carousel-item active">
                <div class="img-wrapper">
                    <img :src="getIHostTokenTip" alt="" />
                </div>
                <p class="help-block-title">{{ t('SETTINGS.STEP_1') }}</p>
                <p class="help-block-title">{{ t('SETTINGS.STEP_2') }}</p>
                <p class="help-block-title tips">Tips:</p>
                <ul class="help-block">
                    <li>{{ t('SETTINGS.TIP_1') }}</li>
                    <li>{{ t('SETTINGS.TIP_2') }}</li>
                </ul>
            </div>
            <div class="carousel-item">
                <div class="img-wrapper">
                    <img :src="getNsPanelProTokenTip" alt="" />
                </div>
                <p class="help-block-title">{{ t('SETTINGS.STEP_1_NS_PANEL') }}</p>
                <p class="help-block-title">{{ t('SETTINGS.STEP_2_NS_PANEL') }}</p>
                <p class="help-block-title">{{ t('SETTINGS.STEP_3_NS_PANEL') }}</p>
                <p class="help-block-title tips">Tips:</p>
                <ul class="help-block">
                    <li>{{ t('SETTINGS.TIP_1_NS_PANEL') }}</li>
                </ul>
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-target="#tutorial-carousel" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-target="#tutorial-carousel" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </button>
    </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Get the Chinese and English gif of the token prompt
const getIHostTokenTip =
    window.homebridge.serverEnv.env.lang === 'zh-CN'
        ? 'https://ewelink.cc/wp-content/uploads/2023/03/get-token-tip-zh.gif'
        : 'https://ewelink.cc/wp-content/uploads/2023/03/get-token-tip-en.gif';
// TODO need english version pic
const getNsPanelProTokenTip =
    window.homebridge.serverEnv.env.lang === 'zh-CN'
        ? 'https://ewelink.cc/wp-content/uploads/2023/03/get-ns-panel-pro-token-tip-zh.gif'
        : 'https://ewelink.cc/wp-content/uploads/2023/03/get-ns-panel-pro-token-tip-zh.gif';
</script>

<style lang="scss">
#tutorial-carousel {
    height: 565px;

    .carousel-control-next,
    .carousel-control-prev {
        bottom: 25%;
    }

    .carousel-item {
        padding: 6px;

        ul {
            list-style: inside;
        }

        .help-block-title {
            font-size: 16px;
            font-weight: 500;
            color: #424242;
            line-height: 24px;
        }

        .tips {
            padding-top: 10px;
        }

        .help-block {
            color: #a1a1a1;
        }

        .img-wrapper {
            width: 100%;
            padding-bottom: 15px;
            img {
                width: 100%;
                border-radius: 8px;
            }
        }
    }
}
</style>
