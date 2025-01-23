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
                    projectRow: {
                        projectName: 'Projects',
                    },
                    projectDashboard: {
                        title: 'Project Dashboard',
                    },
                    projectPath: {
                        title: 'Projects'
                    },
                    projectView: {
                        loading: 'Loading',
                    },
                    sidebar: {
                        summary: 'Summary',
                        taskList: 'Task List',
                        kanban: 'Kanban',
                        ganttChart: 'GanttChart',
                        calendar: 'Calendar',
                        CPM: 'CPM',
                        EVM: 'EVM',
                    },
                    calendar: {
                        title: 'Calendar',
                        days: {
                            sun: 'Sun',
                            mon: 'Mon',
                            tue: 'Tue',
                            wed: 'Wed',
                            thu: 'Thu',
                            fri: 'Fri',
                            sat: 'Sat',
                        },
                        months: {
                            january: 'January',
                            february: 'February',
                            march: 'March',
                            april: 'April',
                            may: 'May',
                            june: 'June',
                            july: 'July',
                            august: 'August',
                            september: 'September',
                            october: 'October',
                            november: 'November',
                            december: 'December',
                        },
                        eventPopup: {
                            time: 'Time',
                            hours: 'Hours',
                            minutes: 'Minutes',
                            placeholder: 'Enter Event Text (Maximum 60 Characters)',
                            addButton: 'Add Event',
                            removeButton: 'Remove Event',
                        },
                        eventButtons: {
                            edit: 'Edit',
                            delete: 'Delete',
                        },
                    },
                    CPM: {
                        title: 'CPM',
                    },
                    EVM: {
                        title: 'EVM',
                    },
                    ganttChart: {
                        title: 'GanttChart',
                    },
                    kanban: {
                        title: 'Kanban',
                        toDo: 'To Do',
                        inProgress: 'In Progress',
                        done: 'Done',
                        onHold: 'On Hold',
                    },
                    summary: {
                        title: 'Summary',
                    },
                    taskList: {
                        tasks: 'Tasks',
                        subProjects: 'Sub Projects',
                    },
                },
            },
            scn: {
                translation: {
                    navbar: {
                        home: '主页',
                        menu: '菜单',
                        project: '项目',
                    },
                    projectRow: {
                        projectName: '项目',
                    },
                    projectDashboard: {
                        title: '项目仪表板',
                    },
                    projectPath: {
                        title: '项目'
                    },
                    projectView: {
                        loading: '加载中'
                    },
                    sidebar: {
                        summary: '摘要',
                        taskList: '任务列表',
                        kanban: '看板',
                        ganttChart: '甘特图',
                        calendar: '日历',
                        CPM: '关键路径法',
                        EVM: '挣值管理',
                    },
                    calendar: {
                        title: '日历',
                        days: {
                            sun: '日',
                            mon: '一',
                            tue: '二',
                            wed: '三',
                            thu: '四',
                            fri: '五',
                            sat: '六',
                        },
                        months: {
                            january: '一月',
                            february: '一月',
                            march: '三月',
                            april: '四月',
                            may: '五月',
                            june: '六月',
                            july: '七月',
                            august: '八月',
                            september: '九月',
                            october: '十月',
                            november: '十一月',
                            december: '十二月',
                        },
                        eventPopup: {
                            time: '时间',
                            hours: '小时',
                            minutes: '分钟',
                            placeholder: '输入事件文字（最多60个字符）',
                            addButton: '添加事件',
                            removeButton: '关闭',
                        },
                        eventButtons: {
                            edit: '编辑',
                            delete: '删除',
                        },
                    },
                    CPM: {
                        title: '关键路径法',
                    },
                    EVM: {
                        title: '挣值管理',
                    },
                    ganttChart: {
                        title: '甘特图',
                    },
                    kanban: {
                        title: '看板',
                        toDo: '待办',
                        inProgress: '进行中',
                        done: '搁置',
                        onHold: '完成',
                    },
                    summary: {
                        title: '摘要',
                    },
                    taskList: {
                        tasks: '任务',
                        subProjects: '子项目',
                    },
                },
            },
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
