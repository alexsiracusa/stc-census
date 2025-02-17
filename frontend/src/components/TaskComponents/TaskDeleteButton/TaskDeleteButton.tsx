import './TaskDeleteButton.css'

import {useState} from "react";
import Popup from "../../Popup/Popup.tsx";
import Trash from '../../../assets/Icons/Trash2.svg'

type TaskDeleteButtonProps = {
    project_id: number,
    task_id: number,
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
            <p>Delete task</p>
        </Popup>
    )
}

export default TaskDeleteButton