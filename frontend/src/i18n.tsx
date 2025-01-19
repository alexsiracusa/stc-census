import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: 'en',
        resources: {
            en: {
                translation: {
                    navbar: {
                        home: 'Home',
                        menu: 'Menu',
                        project: 'Project',
                    },
                    greeting: 'Hello, Welcome!',
                },
            },
            scn: {
                translation: {
                    navbar: {
                        home: '主页',
                        menu: '菜单',
                        project: '项目',
                    },
                    greeting: '您好，欢迎光临！',
                },
            },
            tcn: {
                translation: {
                    navbar: {
                        home: '主頁',
                        menu: '菜單',
                        project: '項目',
                    },
                    greeting: '您好，歡迎光臨！',
                },
            },
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
