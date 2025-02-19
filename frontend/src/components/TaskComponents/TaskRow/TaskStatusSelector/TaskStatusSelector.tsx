import './TaskStatusSelector.css'

import {TaskStatusInfo, TaskStatuses} from "../../../../types/TaskStatuses.ts";
import {useSelector} from 'react-redux';

import useUpdateTask from "../../../../hooks/useUpdateTask.ts";
import StatusSelector from "../../../GenericComponents/StatusSelector/StatusSelector.tsx";
import {format} from "date-fns";

type TaskStatusSelectorProps = {
    project_id: number
    task_id: number
}

const TaskStatusSelector = (props: TaskStatusSelectorProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const {updateTask, loading, error, data} = useUpdateTask();

    const handleUpdate = (status) => {
        if (status === task.status) { return; }
        const body = {status: status}
        if (status === 'done') body['actual_completion_date'] = format(new Date(), 'yyyy-MM-dd')
        updateTask(props.project_id, props.task_id, body);
    };

    const selected = {
        value: task.status,
        displayName: TaskStatusInfo[task.status].name,
        color: TaskStatusInfo[task.status].color
    }

    const options = TaskStatuses.map((status: string) => ({
        value: status,
        displayName: TaskStatusInfo[status].name,
        color: TaskStatusInfo[status].color
    }))

    return (
        <StatusSelector value={selected} options={options} onChange={handleUpdate}/>
    )
};

export default TaskStatusSelector;