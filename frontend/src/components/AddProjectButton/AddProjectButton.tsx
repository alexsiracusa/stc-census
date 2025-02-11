import './AddProjectButton.css'

import Plus from '../../assets/Icons/Plus.svg'
import {useRef, useState} from "react";

type AddTaskButtonProps = {
    project_id: number
}

const AddProjectButton = (props: AddTaskButtonProps) => {
    const [name, setName] = useState("")
    // const {createTask, loading, error, data} = useCreateTask();
    const ref = useRef(null);

    const enterInput = () => {
        if (name !== "") {
            // createTask(props.project_id, {
            //     name: name
            // })
            setName("")
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            enterInput()
        }
    };

    const handleButton = () => {
        ref.current.focus()
    }

    return (
        <div className='add-project-button'>
            <div className='icon-container'>
                <div
                    className='icon'
                    onClick={handleButton}
                >
                    <img src={Plus}/>
                </div>
            </div>
            <input
                ref={ref}
                type="text"
                placeholder="Add Project"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={enterInput}
            />
        </div>
    )
}

export default AddProjectButton;