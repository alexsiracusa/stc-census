import './EditDependenciesDropdown.css'

import DropdownPicker from "../../../../Dropdowns/DropdownPicker/DropdownPicker.tsx";
import React, {Children, PropsWithChildren} from "react";
import {useSelector} from "react-redux";
import useUpdateTask from "../../../../../hooks/useUpdateTask.ts";
import TaskDependsEditor from "../../../../TaskDependsEditor/TaskDependsEditor.tsx";

type MoreTasksDropdownProps = {
    className: string
    title: string

    project_id: number
    task_id: number
}

const EditDependenciesDropdown = (props: PropsWithChildren<MoreTasksDropdownProps>) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const tasks = useSelector((state) => state.projects.byId[props.project_id].byId);
    const {updateTask, loading, error, data} = useUpdateTask();
    const [isVisible, setIsVisible] = React.useState(false);

    const depends_on = Object.values(tasks).filter((option) => task.depends_on.some((task) => task.project_id === option.project_id && task.task_id === option.id))
    const options = Object.values(tasks).filter((option) => !task.depends_on.some((task) => task.project_id === option.project_id && task.task_id === option.id))

    const icon = <>{
        Children.map(props.children, child => {
            return child
        })
    }</>

    return (
        <DropdownPicker
            icon={icon}
            buttonClassName={props.className}
            contentClassName='more-tasks-dropdown-container'
            containerAlignment='flex-end'
            contentAlignment='flex-end'
            title={props.title}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
        >
            <div className='more-tasks-dropdown-content'>
                <TaskDependsEditor project_id={props.project_id} task_id={props.task_id}/>
            </div>
        </DropdownPicker>
    )
}

export default EditDependenciesDropdown;