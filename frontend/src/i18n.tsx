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
                    projectRow: 'Projects',
                    projectDashboard: {
                        title: 'Project Dashboard',
                    },
                    sidebar: {
                        summary: 'Summary',
                        taskList: 'Task List',
                        kanban: 'Kanban',
                        ganttChart: 'GanttChart',
                        calendar: 'Calendar',
                        CPM: 'CPM',
                        EVM: 'EVM',
                    }
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
                    projectRow: '项目',
                    projectDashboard: {
                        title: '项目仪表板',
                    },
                    sidebar: {
                        summary: '摘要',
                        taskList: '任务列表',
                        kanban: '看板',
                        ganttChart: '甘特图',
                        calendar: '日历',
                        CPM: '关键路径法',
                        EVM: '挣值管理',
                    }
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
                    projectRow: '項目',
                    projectDashboard: {
                        title: '項目儀表板',
                    },
                    sidebar: {
                        summary: '摘要',
                        taskList: '任務列表',
                        kanban: '看板',
                        ganttChart: '甘特圖',
                        calendar: '日曆',
                        CPM: '關鍵路徑法',
                        EVM: '賺值管理',
                    }
                },
            },
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
