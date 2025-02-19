import './TaskRow.css'
import {SortOptions} from "../../../utils/sort.ts";
import {Task} from "../../../types/Task.ts";

type TaskRowHeaderProps = {
    taskSortOptions: SortOptions<Task>,
    setTaskSortOptions: (options: SortOptions<Task>) => void
}

import TriangleDown from '../../../assets/Icons/TriangleDown.svg'
import TriangleUp from '../../../assets/Icons/TriangleUp.svg'
import {useTranslation} from "react-i18next";

const TaskRowHeader = (props: TaskRowHeaderProps) => {
    const {t} = useTranslation();

    const columns = [
        {
            displayName: t('taskList.columns.id'),
            columnName: 'id',
            className: 'task-id-header',
            disabled: false,
        },
        {
            displayName: t('taskList.columns.name'),
            columnName: 'name',
            className: 'task-name-header',
            disabled: false,
        },
        {
            displayName: t('taskList.columns.status'),
            columnName: 'status',
            className: 'task-status-header',
            disabled: false,
        },
        {
            displayName: t('taskList.columns.dependsOn'),
            columnName: 'depends_on',
            className: 'task-depends-list-header',
            disabled: true,
        },
        {
            displayName: t('taskList.columns.startDate'),
            columnName: 'target_start_date',
            className: 'task-start-date-header',
            disabled: false,
        },
        {
            displayName: t('taskList.columns.dueDate'),
            columnName: 'target_completion_date',
            className: 'task-due-date-header',
            disabled: false,
        },
        {
            displayName: t('taskList.columns.budget'),
            columnName: 'expected_cost',
            className: 'task-budget-header',
            disabled: false,
        },
        {
            displayName: t('taskList.columns.actualCost'),
            columnName: 'actual_cost',
            className: 'task-actual-cost-header',
            disabled: false,
        },
        {
            displayName: t('taskList.columns.daysToComplete'),
            columnName: 'target_days_to_complete',
            className: 'task-days-to-complete-header',
            disabled: false,
        },
        {
            displayName: t('taskList.columns.actualStartDate'),
            columnName: 'actual_start_date',
            className: 'task-actual-start-date-header',
            disabled: false,
        },
        {
            displayName: t('taskList.columns.actualEndDate'),
            columnName: 'actual_completion_date',
            className: 'task-actual-end-date-header',
            disabled: false,
        }
    ]

    return (
        <div className='task-row-header'>
            {columns.map((column) => (
                <div
                    className={column.className + " header"}
                    key={column.columnName}
                >
                    <div
                        className='header-button'
                        onClick={() => {
                            if (props.taskSortOptions.key === column.columnName) {
                                props.setTaskSortOptions({
                                    key: column.columnName,
                                    order: props.taskSortOptions.order === 'desc' ? 'asc' : 'desc'
                                })
                            } else {
                                props.setTaskSortOptions({
                                    key: column.columnName,
                                    order: 'asc'
                                } as SortOptions<Task>)
                            }
                        }}
                    >
                        <p
                            className='task-field-header'
                            style={{
                                fontWeight: column.columnName === props.taskSortOptions.key ? 'bold' : 'normal'
                            }}
                        >
                            {column.displayName}
                        </p>
                        {column.columnName === props.taskSortOptions.key &&
                            <img src={props.taskSortOptions.order === 'asc' ? TriangleUp : TriangleDown}/>
                        }
                    </div>
                </div>
            ))}
        </div>
    )
};

export default TaskRowHeader;