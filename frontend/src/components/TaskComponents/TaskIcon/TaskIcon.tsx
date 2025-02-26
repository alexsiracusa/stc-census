import './TaskIcon.css'

import {TaskStatusInfo} from "../../../types/TaskStatuses.ts";
import {useSelector} from "react-redux";
import useFetchTask from "../../../hooks/useFetchTask.ts";
import TaskPopup from "../TaskPopup/TaskPopup.tsx";

type TaskIconProps = {
    project_id: number,
    task_id: number
}

const TaskIcon = (props: TaskIconProps) => {
    const {loading, error} = useFetchTask(props.project_id, props.task_id);
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const task = (project && project.byId && project.byId[props.task_id]) ? project.byId[props.task_id] : null

    return (
        <TaskPopup
            project_id={props.project_id}
            task_id={props.task_id}
            buttonClassName='task-icon'
        >
            <div
                className='task-icon'
                title={task ? `${task.name}` : ''}
                key={props.task_id}
                style={{
                    backgroundColor: TaskStatusInfo[task ? task.status : 'to_do'].color + '45',
                    color: TaskStatusInfo[task ? task.status : 'to_do'].color
                }}
            >
                <p>{props.task_id}</p>
            </div>
        </TaskPopup>
    )
}

export default TaskIcon