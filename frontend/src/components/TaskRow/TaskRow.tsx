import './TaskRow.css'

import TaskStatusSelector from "./TaskStatusSelector/TaskStatusSelector.tsx";
import TaskDependsList from "./TaskDependsList/TaskDependsList.tsx";
import TaskDatePicker from "./TaskDatePicker/TaskDatePicker.tsx";
import {useSelector} from "react-redux";
import useUpdateTask from "../../hooks/useUpdateTask.ts";
import TaskName from "./TaskName/TaskName.tsx";
import TaskPopup from "../TaskPopup/TaskPopup.tsx";

type TaskRowProps = {
    project_id: number
    task_id: number
}

const TaskRow = (props: TaskRowProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const {updateTask, loading, error, data} = useUpdateTask();

    if (task === undefined) {
        return <></>
    }

    const isOverdue = () => {
        const now = new Date();
        now.setHours(0,0,0,0);
        return task.status !== 'done' && task.target_completion_date && (new Date(task.target_completion_date) < now)
    }

    return (
        <div className={'task-row ' + (isOverdue() ? 'overdue' : '')}>
            <TaskPopup project_id={props.project_id} task_id={props.task_id} buttonClassName='task-id'>
                <p>T{task.id}</p>
            </TaskPopup>

            <div className='task-name-container'>
                <TaskName project_id={props.project_id} task_id={props.task_id}/>
            </div>
            <div className='task-status-container'>
                <TaskStatusSelector project_id={props.project_id} task_id={props.task_id}/>
            </div>
            <div className='task-depends-list-container'>
                <TaskDependsList project_id={props.project_id} task_id={props.task_id}/>
            </div>

            <div className='task-start-date'>
                <TaskDatePicker
                    currentDate={task.target_start_date}
                    title='Edit Start Date'
                    onChange={(value) => {
                        updateTask(props.project_id, props.task_id, {target_start_date: value})
                    }}
                />
            </div>

            <div className='task-due-date'>
                <TaskDatePicker
                    currentDate={task.target_completion_date}
                    title='Edit Due Date'
                    onChange={(value) => {
                        updateTask(props.project_id, props.task_id, {target_completion_date: value})
                    }}
                />
            </div>
        </div>
    )
};

export default TaskRow;