import './TaskCard.css'

import { Link } from "react-router";

type KanbanTaskProps = {
    task: object
}

const TaskCard = (props: KanbanTaskProps) => {
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

            </Link>
        </div>
    )
};

export default TaskCard;
