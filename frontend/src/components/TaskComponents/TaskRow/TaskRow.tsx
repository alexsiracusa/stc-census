import './TaskRow.css'

import TaskStatusSelector from "./TaskStatusSelector/TaskStatusSelector.tsx";
import TaskDependsList from "./TaskDependsList/TaskDependsList.tsx";
import SimpleDatePicker from "../../GenericComponents/SimpleDatePicker/SimpleDatePicker.tsx";
import {useSelector} from "react-redux";
import useUpdateTask from "../../../hooks/useUpdateTask.ts";
import TaskName from "../TaskName/TaskName.tsx";
import TaskPopup from "../TaskPopup/TaskPopup.tsx";
import NumberEditor from "../../GenericComponents/NumberEditor/NumberEditor.tsx";

type TaskRowProps = {
    project_id: number
    task_id: number
    editing: boolean
    select: (boolean) => void
}

const TaskRow = (props: TaskRowProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const {updateTask, loading, error, data} = useUpdateTask();

    if (task === undefined) {
        return <></>
    }

    const isOverdue = () => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return task.status !== 'done' && task.target_completion_date && (new Date(task.target_completion_date) < now)
    }

    return (
        <div className={'task-row ' + (isOverdue() ? 'overdue' : '')}>
            {props.editing ? (
                <div className='task-id'>
                    <input
                        type="checkbox"
                        onChange={(e) => {
                            props.select(e.target.checked)
                        }}
                    />
                </div>
            ) : (
                <TaskPopup project_id={props.project_id} task_id={props.task_id} buttonClassName='task-id'>
                    <p>T{task.id}</p>
                </TaskPopup>
            )}

            <TaskPopup project_id={props.project_id} task_id={props.task_id} buttonClassName='task-name-container'>
                <p>{task.name}</p>
            </TaskPopup>

            {/*<div className='task-name-container'>*/}
            {/*    <TaskPopup project_id={props.project_id} task_id={props.task_id} buttonClassName='task-name'>*/}
            {/*        <p>T{task.name}</p>*/}
            {/*    </TaskPopup>*/}
            {/*    /!*<TaskName project_id={props.project_id} task_id={props.task_id}/>*!/*/}
            {/*</div>*/}
            <div className='task-status-container'>
                <TaskStatusSelector project_id={props.project_id} task_id={props.task_id}/>
            </div>
            <div className='task-depends-list-container'>
                <TaskDependsList project_id={props.project_id} task_id={props.task_id}/>
            </div>

            <div className='task-start-date'>
                <SimpleDatePicker
                    currentDate={task.target_start_date}
                    title='Edit Start Date'
                    onChange={(value) => {
                        updateTask(props.project_id, props.task_id, {target_start_date: value})
                    }}
                />
            </div>

            <div className='task-due-date'>
                <SimpleDatePicker
                    currentDate={task.target_completion_date}
                    title='Edit Due Date'
                    onChange={(value) => {
                        updateTask(props.project_id, props.task_id, {target_completion_date: value})
                    }}
                />
            </div>

            <div className='task-budget'>
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
                <SimpleDatePicker
                    currentDate={task.actual_start_date}
                    title='Edit Actual Start Date'
                    onChange={(value) => {
                        updateTask(props.project_id, props.task_id, {actual_start_date: value})
                    }}
                />
            </div>

            <div className='task-actual-end-date'>
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
};

export default TaskRow;