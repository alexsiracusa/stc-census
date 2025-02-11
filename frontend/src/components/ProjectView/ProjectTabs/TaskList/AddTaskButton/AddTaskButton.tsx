import './AddTaskButton.css'

import Plus from '../../../../../assets/Icons/Plus.svg'

const AddTaskButton = () => {
    return (
        <div className='add-task-button'>
            <div className='icon-container'>
                <div className='icon'>
                    <img src={Plus}/>
                </div>
            </div>
            Add Task
        </div>
    )
}

export default AddTaskButton;