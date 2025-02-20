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
import Path from "../../GenericComponents/Path/Path.tsx";
import TaskDeleteButton from "../TaskDeleteButton/TaskDeleteButton.tsx";

type TaskPopupProps = {
    project_id: number,
    task_id: number,
    buttonClassName: string
}

const TaskPopup = (props: PropsWithChildren<TaskPopupProps>) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const {t} = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    if (!task) {
        return null;
    }

    const icon = <>{
        Children.map(props.children, child => {
            return child
        })
    }</>

    const path = [{
        name: t('projectPath.title'),
        link: '/projects'
    }].concat(project.path.map((project) => ({
        name: project.name,
        link: `/project/${project.id}/task-list`
    }))).concat([{
        name: task.name,
        link: `/project/${task.project_id}/task-list`
    }]);

    return (
        <Popup
            icon={icon}
            buttonClassName={props.buttonClassName}
            contentClassName='task-popup-content'
            title={task.name}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            transparentBackground={false}
        >
            <div className='task-detail'>
                <div className='task-information'>
                    <div className='top-row'>
                        <div className='task-path-container'>
                            <Path path={path}/>
                        </div>

                        <div className='task-delete-button-container'>
                            <TaskDeleteButton
                                project_id={props.project_id}
                                task_id={props.task_id}
                                onDelete={() => {
                                    setIsVisible(false)
                                }}
                            />
                        </div>
                    </div>

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