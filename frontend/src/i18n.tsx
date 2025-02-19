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
                        project: 'Project',
                        userGuide: 'User Guide',
                        documentation: 'Documentation',
                        logout: 'Logout',
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
                        ganttChart: 'Gantt Chart',
                        calendar: 'Calendar',
                        CPM: 'CPM',
                        EVM: 'EVM',
                    },
                    calendar: {
                        allEventsPopup: {
                            title: 'All Events',
                            noEvents: 'No events scheduled for this day.',
                        },
                        calendarGrid: {
                            more: 'more',
                            noNote: "(No note)",
                            linkCopied: "Event link copied to clipboard!",
                            invitationSubject: "Invitation to {{title}}",
                            invitationBody: "Please join the event: {{title}} from {{start}} to {{end}}.",
                        },
                        calendarHeader: {
                            today: 'Today',
                            previousYear: 'Previous Year',
                            previousMonth: 'Previous Month',
                            nextMonth: 'Next Month',
                            nextYear: 'Next Year',
                        },
                        eventForm: {
                            defaultTitle: '(No title)',
                            endDateError: 'End date cannot be before the start date.',
                            titlePlaceholder: 'Add title',
                            startDate: 'Start date',
                            endDate: 'End date',
                            notePlaceholder: 'Add note',
                            saveButton: 'Save',
                            locale: 'en-US',
                            noNote: '',
                            note: 'Note',
                            status: 'Status',
                        },
                        eventPopup: {
                            edit: "Edit",
                            delete: "Delete",
                            email: "Email",
                            close: "Close",
                            note: "Note"
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
                        days: {
                            sun: 'Sun',
                            mon: 'Mon',
                            tue: 'Tue',
                            wed: 'Wed',
                            thu: 'Thu',
                            fri: 'Fri',
                            sat: 'Sat',
                            sunday: 'Sunday',
                            monday: 'Monday',
                            tuesday: 'Tuesday',
                            wednesday: 'Wednesday',
                            thursday: 'Thursday',
                            friday: 'Friday',
                            saturday: 'Saturday',
                        },
                    },
                    CPM: {
                        title: 'CPM',
                    },
                    EVM: {
                        title: 'EVM',
                    },
                    ganttChart: {
                        title: 'Gantt Chart',
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

                        columns: {
                            id: 'ID',
                            name: 'Name',
                            status: 'Status',
                            dependsOn: 'Depends On',
                            startDate: 'Start Date',
                            dueDate: 'Due Date',
                            budget: 'Budget',
                            actualStartDate: 'Actual Start',
                            actualEndDate: 'Actual End'
                        }
                    },
                    projectList: {
                        subProjects: 'Sub Projects',

                        columns: {
                            id: 'ID',
                            name: 'Name',
                            status: 'Status',
                            tasks: 'Tasks',
                            startDate: 'Start Date',
                            dueDate: 'Due Date',
                        }
                    },
                    addProject: 'Add Project',
                    addTask: 'Add Task',
                    taskDependsEditor: {
                        dependsOn: 'Depends On',
                        addDependencies: 'Add Dependencies',
                        add: 'Add',
                        remove: 'Remove',
                    },
                },
            },
            scn: {
                translation: {
                    navbar: {
                        project: '项目',
                        userGuide: '用户指南',
                        documentation: '文档',
                        logout: '退出',
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
                        allEventsPopup: {
                            title: '所有事件',
                            noEvents: '今天没有安排的事件。',
                        },
                        calendarGrid: {
                            more: '更多',
                            noNote: "(无备注)",
                            linkCopied: "事件链接已复制到剪贴板！",
                            invitationSubject: "邀请参加{{title}}",
                            invitationBody: "请参加事件：{{title}} 从 {{start}} 到 {{end}}。",
                        },
                        calendarHeader: {
                            today: '今天',
                            previous: '上一页',
                            next: '下一页',
                        },
                        eventForm: {
                            defaultTitle: '(无标题)',
                            endDateError: '结束日期不能早于开始日期。',
                            titlePlaceholder: '添加标题',
                            startDate: '开始日期',
                            endDate: '结束日期',
                            notePlaceholder: '添加注释',
                            saveButton: '保存',
                            locale: 'zh-CN',
                            noNote: '',
                            note: '笔记',
                            status: '地位',
                        },
                        eventPopup: {
                            edit: "编辑",
                            delete: "删除",
                            email: "邮件",
                            close: "关闭",
                            note: "笔记",
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
                        days: {
                            sun: "日",
                            mon: "一",
                            tue: "二",
                            wed: "三",
                            thu: "四",
                            fri: "五",
                            sat: "六",
                            sunday: "星期日",
                            monday: "星期一",
                            tuesday: "星期二",
                            wednesday: "星期三",
                            thursday: "星期四",
                            friday: "星期五",
                            saturday: "星期六"
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
                        done: '完成',
                        onHold: '搁置',
                    },
                    summary: {
                        title: '摘要',
                    },
                    taskList: {
                        tasks: '任务',

                        columns: {
                            id: 'ID',
                            name: '名称',
                            status: '状态',
                            dependsOn: '取决于',
                            startDate: '开始日期',
                            dueDate: '到期日',
                            budget: '预算',
                            actualStartDate: '实际开始日期',
                            actualEndDate: '完成日期'
                        }
                    },
                    projectList: {
                        subProjects: '子项目',

                        columns: {
                            id: 'ID',
                            name: '名称',
                            tasks: '任务',
                            status: '状态',
                            startDate: '开始日期',
                            dueDate: '到期日',
                        }
                    },
                    addProject: '添加任务',
                    addTask: '添加项目',
                    taskDependsEditor: {
                        dependsOn: '取决于',
                        addDependencies: '添加依赖项',
                        add: '添加',
                        remove: '消除',
                    },
                },
            },
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
