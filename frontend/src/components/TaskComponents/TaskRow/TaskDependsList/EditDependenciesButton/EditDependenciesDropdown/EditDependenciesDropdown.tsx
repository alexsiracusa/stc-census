import './EditDependenciesDropdown.css'

import DropdownPicker from "../../../../../Dropdowns/DropdownPicker/DropdownPicker.tsx";
import React, {Children, PropsWithChildren} from "react";
import TaskDependsEditor from "../../../../TaskDependsEditor/TaskDependsEditor.tsx";

type MoreTasksDropdownProps = {
    className: string
    title: string

    project_id: number
    task_id: number
}

const EditDependenciesDropdown = (props: PropsWithChildren<MoreTasksDropdownProps>) => {
    const [isVisible, setIsVisible] = React.useState(false);

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