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
                        day_month_year: "{{day}} {{month}} {{date}} {{year}}",
                        days: {
                            sun: 'Sun',
                            mon: 'Mon',
                            tue: 'Tue',
                            wed: 'Wed',
                            thu: 'Thu',
                            fri: 'Fri',
                            sat: 'Sat',
                        },
                        currentDay: {
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
                        currentMonth: {
                            jan: 'Jan',
                            feb: 'Feb',
                            mar: 'Mar',
                            april: 'April',
                            may: 'May',
                            jun: 'Jun',
                            jul: 'Jul',
                            aug: 'Aug',
                            sep: 'Sep',
                            oct: 'Oct',
                            nov: 'Nov',
                            dec: 'Dec',
                        },
                        eventPopup: {
                            time: 'Time',
                            hours: 'Hours',
                            minutes: 'Minutes',
                            placeholder: 'Enter Event Text (Maximum 60 Characters)',
                            addButton: 'Add Event',
                            removeButton: 'Remove Event',
                            updateButton: 'Update Event',
                        },
                        eventButtons: {
                            edit: 'Edit',
                            delete: 'Delete',
                        },
                        addEventButton: 'Add Event',
                        today: 'Today',
                        event: 'Event',
                        task: 'Task',
                        addTitle: 'Add Title',
                        addDescription: 'Add Description',
                        save: 'Save',
                        more: 'More',
                        repeatNo: 'Does not repeat',
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
                        day_month_year: "{{year}}年{{month}}{{date}}日 {{day}}",
                        currentDay: {
                            "sun": "日",
                            "mon": "一",
                            "tue": "二",
                            "wed": "三",
                            "thu": "四",
                            "fri": "五",
                            "sat": "六"
                        },
                        months: {
                            january: '一月',
                            february: '二月',
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
                        currentMonth: {
                            jan: "一月",
                            feb: "二月",
                            mar: "三月",
                            apr: "四月",
                            may: "五月",
                            jun: "六月",
                            jul: "七月",
                            aug: "八月",
                            sep: "九月",
                            oct: "十月",
                            nov: "十一月",
                            dec: "十二月"
                        },
                        eventPopup: {
                            time: '时间',
                            hours: '小时',
                            minutes: '分钟',
                            placeholder: '输入事件文字（最多60个字符）',
                            addButton: '添加事件',
                            removeButton: '关闭',
                            updateButton: '更新事件',
                        },
                        eventButtons: {
                            edit: '编辑',
                            delete: '删除',
                        },
                        addEventButton: '添加事件',
                        today: '今天',
                        event: '事件',
                        task: '任务',
                        addTitle: '添加标题',
                        addDescription: '添加描述',
                        save: '保存',
                        more: '更多',
                        repeatNo: '不重复',
                        eventsOnDate: "{{date}}"
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
