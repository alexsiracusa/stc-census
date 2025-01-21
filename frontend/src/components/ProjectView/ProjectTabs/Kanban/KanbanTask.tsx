import './KanbanTask.css'

import { Link } from "react-router";

type KanbanTaskProps = {
    task: object
}

const KanbanTask = (props: KanbanTaskProps) => {
    const task = props.task;

    return (
        <div className='task'>
            <Link
                reloadDocument
                to={`/`}
            >
                <div className='task-header'>
                    <div>T{task['id']}</div>
                    <div>{task['name']}</div>
                </div>

                <div className='task-description'>{task['description']}</div>
            </Link>
        </div>
    )
};

export default KanbanTask;
