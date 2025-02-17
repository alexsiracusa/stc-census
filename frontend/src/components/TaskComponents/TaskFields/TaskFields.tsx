import './TaskFields.css'
import {useSelector} from "react-redux";
import TaskDatePicker from "../TaskRow/TaskDatePicker/TaskDatePicker.tsx";
import useUpdateTask from "../../../hooks/useUpdateTask.ts";

type TaskFieldsProps = {
    project_id: number,
    task_id: number,
}

const TaskFields = (props: TaskFieldsProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const {updateTask, loading, error, data} = useUpdateTask();

    return (
        <div className='task-fields'>
            <div className='task-start-date'>
                <div className='task-field-header'>Start Date:</div>
                <TaskDatePicker
                    currentDate={task.target_start_date}
                    title='Edit Start Date'
                    onChange={(value) => {
                        updateTask(props.project_id, props.task_id, {target_start_date: value})
                    }}
                />
            </div>

            <div className='task-end-date'>
                <div className='task-field-header'>Due Date:</div>
                <TaskDatePicker
                    currentDate={task.target_completion_date}
                    title='Edit Due Date'
                    onChange={(value) => {
                        updateTask(props.project_id, props.task_id, {target_completion_date: value})
                    }}
                />
            </div>

            <div className='task-actual-start-date'>
                <div className='task-field-header'>Actual Start Date:</div>
                <TaskDatePicker
                    currentDate={task.actual_start_date}
                    title='Edit Actual Completion Date'
                    onChange={(value) => {
                        updateTask(props.project_id, props.task_id, {actual_start_date: value})
                    }}
                />
            </div>

            <div className='task-actual-end-date'>
                <div className='task-field-header'>Actual End Date:</div>
                <TaskDatePicker
                    currentDate={task.actual_completion_date}
                    title='Edit Actual End Date'
                    onChange={(value) => {
                        updateTask(props.project_id, props.task_id, {actual_completion_date: value})
                    }}
                />
            </div>

        </div>
    )
}

export default TaskFields