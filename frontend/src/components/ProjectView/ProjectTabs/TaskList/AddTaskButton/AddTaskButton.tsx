import './AddTaskButton.css'

import Plus from '../../../../../assets/Icons/Plus.svg'
import {useState} from "react";
import useCreateTask from "../../../../../hooks/useCreateTask.ts";

type AddTaskButtonProps = {
    project_id: number
}

const AddTaskButton = (props: AddTaskButtonProps) => {
    const [name, setName] = useState("")
    const {createTask, loading, error, data} = useCreateTask();

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && name !== "") {
            createTask(props.project_id, {
                name: name
            })
            setName("")
        }
    };

    const handleBlur = () => {
        if (name !== "") {
            createTask(props.project_id, {
                name: name
            })
            setName("")
        }
    };

    return (
        <div className='add-task-button'>
            <div className='icon-container'>
                <div className='icon'>
                    <img src={Plus}/>
                </div>
            </div>
            <input
                type="text"
                placeholder="Add Task"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
            />
        </div>
    )
}

export default AddTaskButton;