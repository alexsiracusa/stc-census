import './TaskPopup.css'
import Popup from "../Popup/Popup.tsx";
import {useSelector} from "react-redux";
import React, {Children, PropsWithChildren} from "react";

type TaskPopupProps = {
    project_id: number,
    task_id: number,
    buttonClassName: string
}

const TaskPopup = (props: PropsWithChildren<TaskPopupProps>) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const [isVisible, setIsVisible] = React.useState(false);

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
            <div>
                Task Popup
            </div>
        </Popup>
    )
}

export default TaskPopup