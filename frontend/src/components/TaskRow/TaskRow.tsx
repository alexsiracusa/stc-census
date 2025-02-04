import './TaskRow.css'

import {useNavigate} from "react-router-dom";
import TaskStatusSelector from "../TaskStatusSelector/TaskStatusSelector.tsx";
import TaskDependsList from "./TaskDependsList/TaskDependsList.tsx";
import TaskDatePicker from "./TaskDatePicker/TaskDatePicker.tsx";
import {useSelector} from "react-redux";
import { format } from 'date-fns';

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'dd-MM-yy')
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
                <TaskStatusSelector project_id={props.project_id} task_id={props.task_id}/>
            </div>
            <div className='task-depends-list-container'>
                <TaskDependsList project_id={props.project_id} task_id={props.task_id}/>
            </div>

            <div className='task-end-date'>
                <TaskDatePicker currentDate={task.target_start_date} onChange={(value) => {
                    console.log(value)
                }}/>
            </div>

            <div className='task-end-date'>
                <TaskDatePicker currentDate={task.target_completion_date} onChange={(value) => {
                    console.log(value)
                }}/>
            </div>
        </div>
    )
};

export default TaskRow;