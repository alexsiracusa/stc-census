import './TaskPopup.css'

import {useSelector} from "react-redux";
import {Children, PropsWithChildren, useState} from "react";
import Popup from "../../GenericComponents/Popup/Popup.tsx";
import TaskDependsEditor from "../TaskDependsEditor/TaskDependsEditor.tsx";
import TaskName from "../TaskName/TaskName.tsx";
import TaskDescription from "../TaskDescription/TaskDescription.tsx";
import TaskStatusSelector from "../TaskStatusSelector/TaskStatusSelector.tsx";
import TaskFields from "../TaskFields/TaskFields.tsx";
import {useTranslation} from "react-i18next";
import PathPicker from "../../GenericComponents/Path/PathPicker/PathPicker.tsx";
import TaskDeleteButton from "../TaskDeleteButton/TaskDeleteButton.tsx";
import TaskPopupContent from "./TaskPopupContent.tsx";

type TaskPopupProps = {
    project_id: number,
    task_id: number,
    buttonClassName: string
}

const TaskPopup = (props: PropsWithChildren<TaskPopupProps>) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const task = (project && project.byId && project.byId[props.task_id]) ? project.byId[props.task_id] : null
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
            title={task ? task.name : 'Task'}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            transparentBackground={false}
        >
            <TaskPopupContent
                project_id={props.project_id}
                task_id={props.task_id}
                setIsVisible={setIsVisible}
            />
        </Popup>
    )
}

export default TaskPopup