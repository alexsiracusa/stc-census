import './TaskRow.css'

import {Task} from "../../types/Task.ts";
import {useNavigate} from "react-router-dom";
import TaskStatusSelector from "../TaskStatusSelector/TaskStatusSelector.tsx";

type TaskRowProps = {
    task: Task
}

const TaskRow = (props: TaskRowProps) => {
    const task = props.task;
    const navigate = useNavigate()

    return (
        <div
            className='task-row'
            onClick={() => {
                navigate('/')
            }}
        >
            <div className='task-id'>T{task.id}</div>
            <div className='task-name'>{task.name}</div>
            <div className='task-status-container'>
                <TaskStatusSelector task={task}/>
            </div>
        </div>
    )
};

export default TaskRow;