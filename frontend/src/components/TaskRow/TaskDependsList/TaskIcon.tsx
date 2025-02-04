import './TaskDependsList.css'

import {TaskStatusInfo} from "../../../types/TaskStatuses.ts";
import {useSelector} from "react-redux";

type TaskIconProps = {
    depends_on: number,
    depends_on_project: number
}

const TaskIcon = (props: TaskIconProps) => {
    const task = useSelector((state) => state.projects.byId[props.depends_on_project].byId[props.depends_on]);

    if (task == null) {
        return <></>
    }

    return (
        <div
            className='task-icon'
            title={`P${task.project_id} T${task.id}`}
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