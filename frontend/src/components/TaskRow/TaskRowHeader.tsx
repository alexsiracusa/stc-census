import './TaskRow.css'
import {SortOptions} from "../../utils/sort.ts";
import {Task} from "../../types/Task.ts";

type TaskRowHeaderProps = {
    taskSortOptions: SortOptions<Task>,
    setTaskSortOptions: (options: SortOptions<Task>) => void
}

import TriangleDown from '../../assets/Icons/TriangleDown.svg'
import TriangleUp from '../../assets/Icons/TriangleUp.svg'

const TaskRowHeader = (props: TaskRowHeaderProps) => {

    const columns = [
        {
            displayName: 'ID',
            columnName: 'id',
            className: 'task-id-header',
            disabled: false,
        },
        {
            displayName: 'Name',
            columnName: 'name',
            className: 'task-name-header',
            disabled: false,
        },
        {
            displayName: 'Status',
            columnName: 'status',
            className: 'task-status-header',
            disabled: false,
        },
        {
            displayName: 'Depends On',
            columnName: 'depends_on',
            className: 'task-depends-list-header',
            disabled: true,
        },
        {
            displayName: 'Start Date',
            columnName: 'target_start_date',
            className: 'task-start-date-header',
            disabled: false,
        },
        {
            displayName: 'End Date',
            columnName: 'target_end_date',
            className: 'task-end-date-header',
            disabled: false,
        }
    ]

    return (
        <div className='task-row-header'>
            {columns.map((column) => (
                <div
                    className={column.className + " header"}
                    key={column.columnName}
                    onClick={() => {
                        if (props.taskSortOptions.key === column.columnName) {
                            props.setTaskSortOptions({
                                key: column.columnName,
                                order: props.taskSortOptions.order === 'desc' ? 'asc' : 'desc'
                            })
                        }
                        else {
                            props.setTaskSortOptions({
                                key: column.columnName,
                                order: 'asc'
                            } as SortOptions<Task>)
                        }
                    }}
                >
                    <p
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
            ))}
        </div>
    )
};

export default TaskRowHeader;