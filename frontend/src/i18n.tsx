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

                        login: 'Login',
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
                        },
                        calendarHeader: {
                            today: 'Today',
                            previousYear: 'Previous Year',
                            previousMonth: 'Previous Month',
                            nextMonth: 'Next Month',
                            nextYear: 'Next Year',
                        },
                        taskForm: {
                            createTask: 'Create Task',
                            taskName: 'Task Name',
                            save: 'Save',
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
                            personInCharge: 'PiC',
                            budget: 'Budget',
                            actualCost: 'Actual $',
                            daysToComplete: 'Est. Days',
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
                            personInCharge: 'PiC',
                            budget: 'Budget',
                            actualCost: 'Actual $',
                            budgetVariance: 'Diff. (Loss)',
                            download: '',
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
                        userGuide: '说明书',
                        documentation: '系统文件',

                        login: '登入',
                        logout: '登出',
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
                        summary: '总结',
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
                        taskForm: {
                            createTask: '创建任务',
                            taskName: '任务名称',
                            save: '保存',
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
                        title: '总结',
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
                            personInCharge: '负责人',
                            budget: '预算',
                            actualCost: '实际成本',
                            daysToComplete: '预计日数',
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
                            personInCharge: '负责人',
                            budget: '预算',
                            actualCost: '实际成本',
                            budgetVariance: '差别',
                            download: ''
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
