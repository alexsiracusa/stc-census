import './TaskCard.css'

import {Link} from "react-router";
import {Draggable} from "@hello-pangea/dnd";

type KanbanTaskProps = {
    task: object
    index: number
}

const TaskCard = (props: KanbanTaskProps) => {
    const task = props.task;

    return (
        <Draggable
            key={task.id}
            draggableId={`${task.id}`}
            index={props.index}
        >
            {(provided) => (
                <div
                    className='task-card'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
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
            )}
        </Draggable>
    )
};

export default TaskCard;
