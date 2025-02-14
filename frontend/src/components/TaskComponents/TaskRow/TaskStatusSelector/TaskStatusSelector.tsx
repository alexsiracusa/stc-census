import './TaskStatusSelector.css'

import {TaskStatusInfo, TaskStatuses} from "../../../../types/TaskStatuses.ts";
import {useSelector} from 'react-redux';

import DropdownRowPicker from "../../../Dropdowns/DropdownRowPicker/DropdownRowPicker.tsx";
import DropdownPickerOption from "../../../Dropdowns/DropdownPicker/DropdownPickerOption.tsx";
import useUpdateTask from "../../../../hooks/useUpdateTask.ts";

type TaskStatusSelectorProps = {
    project_id: number
    task_id: number
}

const TaskStatusSelector = (props: TaskStatusSelectorProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const {updateTask, loading, error, data} = useUpdateTask();

    const handleUpdate = (status) => {
        updateTask(props.project_id, props.task_id, {status: status});
    };

    return (
        <div className="task-status-button">
            <DropdownRowPicker
                icon={
                    <div
                        className="dropdown-icon-inner"
                        style={{
                            backgroundColor: TaskStatusInfo[task.status].color + '45',
                            color: TaskStatusInfo[task.status].color
                        }}
                    >
                        <p>{TaskStatusInfo[task.status].name}</p>
                    </div>
                }
                className="dropdown-icon"
                title="Edit Status"
                onChange={handleUpdate}
            >
                {TaskStatuses.map((status: string) => (
                    <DropdownPickerOption
                        value={status}
                        className="task-status"
                        key={status}
                    >
                        <div
                            className="task-status-inner"
                            style={{
                                backgroundColor: TaskStatusInfo[status].color + '45',
                                color: TaskStatusInfo[status].color
                            }}
                        >
                            {`${TaskStatusInfo[status].name}`}
                        </div>
                    </DropdownPickerOption>
                ))}
            </DropdownRowPicker>
        </div>
    )
};

export default TaskStatusSelector;