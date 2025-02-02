import './TaskRow.css'

import {Task} from "../../types/Task.ts";
import {useNavigate} from "react-router-dom";
import TaskStatusSelector from "../TaskStatusSelector/TaskStatusSelector.tsx";
import TaskDependsList from "./TaskDependsList/TaskDependsList.tsx";

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