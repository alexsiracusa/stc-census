import './TaskFields.css'
import {useSelector} from "react-redux";
import SimpleDatePicker from "../../GenericComponents/SimpleDatePicker/SimpleDatePicker.tsx";
import useUpdateTask from "../../../hooks/useUpdateTask.ts";
import NumberEditor from "../../GenericComponents/NumberEditor/NumberEditor.tsx";

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
                <SimpleDatePicker
                    currentDate={task.target_start_date}
                    title='Edit Start Date'
                    onChange={(value) => {
                        updateTask(props.project_id, props.task_id, {target_start_date: value})
                    }}
                />
            </div>

            <div className='task-end-date'>
                <div className='task-field-header'>Due Date:</div>
                <SimpleDatePicker
                    currentDate={task.target_completion_date}
                    title='Edit Due Date'
                    onChange={(value) => {
                        updateTask(props.project_id, props.task_id, {target_completion_date: value})
                    }}
                />
            </div>

            <div className='task-budget'>
                <div className='task-field-header'>Budget:</div>
                <NumberEditor
                    value={task.expected_cost}
                    negative={false}
                    step={10}
                    setValue={(value) => {
                        updateTask(props.project_id, props.task_id, {expected_cost: value})
                    }}
                    title='Edit Budget'
                />
            </div>

            <div className='task-actual-cost'>
                <div className='task-field-header'>Spent:</div>
                <NumberEditor
                    value={task.actual_cost}
                    negative={false}
                    step={10}
                    setValue={(value) => {
                        updateTask(props.project_id, props.task_id, {actual_cost: value})
                    }}
                    title='Edit Actual Cost'
                />
            </div>

            <div className='task-days-to-complete'>
                <div className='task-field-header'>Days to Complete:</div>
                <NumberEditor
                    value={task.target_days_to_complete}
                    negative={false}
                    step={1}
                    setValue={(value) => {
                        updateTask(props.project_id, props.task_id, {target_days_to_complete: value})
                    }}
                    title='Edit Days to Complete'
                />
            </div>

            <div className='task-actual-start-date'>
                <div className='task-field-header'>Actual Start Date:</div>
                <SimpleDatePicker
                    currentDate={task.actual_start_date}
                    title='Edit Actual Completion Date'
                    onChange={(value) => {
                        updateTask(props.project_id, props.task_id, {actual_start_date: value})
                    }}
                />
            </div>

            <div className='task-actual-end-date'>
                <div className='task-field-header'>Actual End Date:</div>
                <SimpleDatePicker
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