import './TaskDeleteButton.css'

import {useState} from "react";
import Popup from "../../Popup/Popup.tsx";
import Trash from '../../../assets/Icons/Trash2.svg'

type TaskDeleteButtonProps = {
    project_id: number,
    task_id: number,
    onDelete?: () => void;
}

const TaskDeleteButton = (props: TaskDeleteButtonProps) => {
    const [isVisible, setIsVisible] = useState(false);

    const icon = (
        <img src={Trash}/>
    )

    return (
        <Popup
            icon={icon}
            buttonClassName='task-delete-button'
            contentClassName='task-delete-button-confirm'
            title='Delete Task'
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            transparentBackground={true}
        >
            <p>Are you sure you want to delete this task? This cannot be undone.</p>

            <div className='action-items'>
                <button
                    className='delete'
                    onClick={() => {
                        setIsVisible(false)
                        if (props.onDelete) {
                            props.onDelete()
                        }
                    }}
                >
                    <p>Delete</p>
                </button>
                <button
                    className='cancel'
                    onClick={() => {
                        setIsVisible(false)
                    }}
                >
                    <p>Cancel</p>
                </button>
            </div>
        </Popup>
    )
}

export default TaskDeleteButton