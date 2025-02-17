import './TaskPopup.css'

import {useSelector} from "react-redux";
import {Children, PropsWithChildren, useState} from "react";
import Popup from "../../Popup/Popup.tsx";
import TaskDependsEditor from "../TaskDependsEditor/TaskDependsEditor.tsx";
import TaskName from "../TaskName/TaskName.tsx";
import TaskDescription from "../TaskDescription/TaskDescription.tsx";
import TaskStatusSelector from "../TaskRow/TaskStatusSelector/TaskStatusSelector.tsx";
import TaskFields from "../TaskFields/TaskFields.tsx";

type TaskPopupProps = {
    project_id: number,
    task_id: number,
    buttonClassName: string
}

const TaskPopup = (props: PropsWithChildren<TaskPopupProps>) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const [isVisible, setIsVisible] = useState(false);

    const icon = <>{
        Children.map(props.children, child => {
            return child
        })
    }</>

    return (
        <Popup
            icon={icon}
            buttonClassName={props.buttonClassName}
            contentClassName='task-popup-content'
            title='title'
            isVisible={isVisible}
            setIsVisible={setIsVisible}
        >
            <div className='task-detail'>
                <div className='task-information'>
                    <div className='task-name-container'>
                        <TaskName project_id={props.project_id} task_id={props.task_id}/>
                    </div>

                    <div className='task-status-container'>
                        <TaskStatusSelector project_id={props.project_id} task_id={props.task_id}/>
                    </div>

                    <h2>Description:</h2>
                    <div className='task-description-container'>
                        <TaskDescription project_id={props.project_id} task_id={props.task_id}/>
                    </div>
                </div>

                <div className='task-fields-container'>
                    <TaskFields project_id={props.project_id} task_id={props.task_id}/>
                    <TaskDependsEditor project_id={props.project_id} task_id={props.task_id}/>
                </div>
            </div>
        </Popup>
    )
}

export default TaskPopup