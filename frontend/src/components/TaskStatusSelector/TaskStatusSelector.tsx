import './TaskStatusSelector.css'

import {TaskStatusInfo, TaskStatuses} from "../../types/TaskStatuses.ts";
import {useSelector} from 'react-redux';

import Dropdown from "../Dropdown/Dropdown.tsx";
import DropDownRow from "../Dropdown/DropdownRow.tsx";
import { useRef } from "react";
import useUpdateTaskStatus from "../../hooks/useUpdateTaskStatus.ts";

type TaskStatusSelectorProps = {
    project_id: number
    task_id: number
}

const TaskStatusSelector = (props: TaskStatusSelectorProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const {updateTaskStatus, loading, error, data} = useUpdateTaskStatus();
    // const isMounted = useRef(true)

    // set isMounted to false when we unmount the component
    const handleUpdate = (status) => {
        updateTaskStatus(props.project_id, props.task_id, status);
    };

    return (
        <div className="task-status-button">
            <Dropdown
                icon={
                    <div
                        className="dropdown-icon-inner"
                        style={{
                            backgroundColor: TaskStatusInfo[task.status].color + '45',
                            color: TaskStatusInfo[task.status].color
                        }}
                    >
                        {TaskStatusInfo[task.status].name}
                    </div>
                }
                className="dropdown-icon"
                title="Status"
                onChange={handleUpdate}
            >
                {TaskStatuses.map((status: string) => (
                    <DropDownRow
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
                    </DropDownRow>
                ))}
            </Dropdown>
        </div>
    )
};

export default TaskStatusSelector;