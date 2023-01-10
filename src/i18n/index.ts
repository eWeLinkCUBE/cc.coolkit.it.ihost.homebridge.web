import { createI18n } from 'vue-i18n';
import en from './en';
import zh from './zh';

const locale = window.homebridge.serverEnv.env.lang === 'zh-CN' ? 'zh' : 'en';

const i18n = createI18n({
    legacy: false,
    locale,
    messages: {
        en,
        zh
    }
});

export default i18n;
