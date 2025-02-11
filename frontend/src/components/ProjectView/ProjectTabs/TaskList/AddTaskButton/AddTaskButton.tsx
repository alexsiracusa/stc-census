import './AddTaskButton.css'

import Plus from '../../../../../assets/Icons/Plus.svg'
import {useState} from "react";

const AddTaskButton = () => {
    const [name, setName] = useState(null as string)

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
                onChange={(event) => {
                    if (event.key === 'Enter') {
                        this.search()
                    }
                    setName(event.target.value)
                }
                }
            />
        </div>
    )
}

export default AddTaskButton;