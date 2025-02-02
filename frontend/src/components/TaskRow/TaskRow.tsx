import './TaskRow.css'

import {useNavigate} from "react-router-dom";
import TaskStatusSelector from "../TaskStatusSelector/TaskStatusSelector.tsx";
import TaskDependsList from "./TaskDependsList/TaskDependsList.tsx";
import {useSelector} from "react-redux";

type TaskRowProps = {
    project_id: number
    task_id: number
}

const TaskRow = (props: TaskRowProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const navigate = useNavigate()

    if (task === undefined) {
        return <></>
    }

    return (
        <div
            className='task-row'
            onClick={() => {
                navigate('/')
            }}
        >
            <div className='task-id'><p>T{task.id}</p></div>
            <div className='task-name'><p>{task.name}</p></div>
            <div className='task-status-container'>
                <TaskStatusSelector task={task}/>
            </div>
            <div className='task-depends-list-container'>
                <TaskDependsList task={task}/>
            </div>
        </div>
    )
};

export default TaskRow;