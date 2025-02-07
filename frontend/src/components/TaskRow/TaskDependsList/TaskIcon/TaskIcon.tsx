import './TaskIcon.css'

import {TaskStatusInfo} from "../../../../types/TaskStatuses.ts";
import {useSelector} from "react-redux";

type TaskIconProps = {
    project_id: number,
    task_id: number
}

const TaskIcon = (props: TaskIconProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);

    if (task == null) {
        console.log(task, props.project_id, props.task_id)
        return <></>
    }

    return (
        <div
            className='task-icon'
            title={`${task.name}`}
            key={task.id}
            style={{
                backgroundColor: TaskStatusInfo[task.status].color + '45',
                color: TaskStatusInfo[task.status].color
            }}
        >
            <p>{task.id}</p>
        </div>
    )
}

export default TaskIcon