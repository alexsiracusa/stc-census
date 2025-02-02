import './TaskStatusSelector.css'

import {TaskStatusInfo, TaskStatuses} from "../../types/TaskStatuses.ts";
import {Task} from "../../types/Task.ts";

import Dropdown from "../Dropdown/Dropdown.tsx";
import DropDownRow from "../Dropdown/DropdownRow.tsx";
import {useState} from "react";
import TriangleDown from '../../assets/Icons/TriangleDown.svg';

type TaskStatusSelectorProps = {
    task: Task
}

const TaskStatusSelector = (props: TaskStatusSelectorProps) => {
    const [status, setStatus] = useState(props.task.status)

    async function setValue(newValue: string) {
        setStatus(newValue)
    }

    return (
        <div className="task-status-button">
            <Dropdown
                icon={
                    <div
                        className="dropdown-icon-inner"
                        style={{
                            backgroundColor: TaskStatusInfo[status].color + '45',
                            color: TaskStatusInfo[status].color
                        }}
                    >
                        {TaskStatusInfo[status].name}
                    </div>
                }
                className="dropdown-icon"
                title="Status"
                onChange={setValue}
            >
                { TaskStatuses.map((status: string) => (
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