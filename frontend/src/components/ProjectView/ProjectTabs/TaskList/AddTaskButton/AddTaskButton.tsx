import './AddTaskButton.css'

import Plus from '../../../../../assets/Icons/Plus.svg'
import {useState} from "react";

const AddTaskButton = () => {
    const [name, setName] = useState("")

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && name !== "") {
            console.log(name)
            setName("")
        }
    };

    const handleBlur = () => {
        if (name !== "") {
            console.log(name)
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