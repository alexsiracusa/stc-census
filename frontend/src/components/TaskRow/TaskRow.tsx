import './TaskRow.css'

import {Link} from "react-router";

type TaskRowProps = {
    task: object
}

const TaskRow = (props: TaskRowProps) => {
    const task = props.task;

    return (
        <Link
            reloadDocument
            to={`/`}
            className='task-row'
        >
            <div className='task-id'>T{task['id']}</div>
            <div className='task-name'>{task['name']}</div>
        </Link>
    )
};

export default TaskRow;