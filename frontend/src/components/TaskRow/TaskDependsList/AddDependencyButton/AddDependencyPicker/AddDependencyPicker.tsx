import './AddDependencyPicker.css'

import DropdownPicker from "../../../../Dropdowns/DropdownPicker/DropdownPicker.tsx";
import React, {Children, PropsWithChildren} from "react";
import {useSelector} from "react-redux";
import TaskIcon from "../../TaskIcon/TaskIcon.tsx";
import useUpdateTask from "../../../../../hooks/useUpdateTask.ts";

type AddDependencyPickerProps = {
    className: string
    title: string
    onChange: (arg0: any) => void

    project_id: number
    task_id: number
}

const AddDependencyPicker = (props: PropsWithChildren<AddDependencyPickerProps>) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const tasks = useSelector((state) => state.projects.byId[props.project_id].byId);
    const {updateTask, loading, error, data} = useUpdateTask();
    const [isVisible, setIsVisible] = React.useState(false);

    const depends_on_ids = task.depends_on.map((task) => [task.project_id, task.task_id]);
    const options = Object.values(tasks).filter((option) => !depends_on_ids.some((task) => task[0] === option.project_id && task[1] === option.id))

    const icon = <>{
        Children.map(props.children, child => {
            return child
        })
    }</>

    return (
        <DropdownPicker
            icon={icon}
            buttonClassName={props.className}
            contentClassName='add-dependency-picker-content'
            containerAlignment='center'
            contentAlignment='center'
            title={props.title}
            isVisible={isVisible}
            setIsVisible={(value) => {
                setIsVisible(value)
            }}
        >
            {options.map((option) => (
                <button
                    className='task-icon-container'
                    key={option.id}
                    onClick={() => {
                        console.log(task.depends_on)
                        updateTask(props.project_id, props.task_id, {
                            depends_on: [...task.depends_on, {
                                project_id: option.project_id,
                                task_id: option.id
                            }]
                        })
                        setIsVisible(false)
                    }}
                >
                    <TaskIcon
                        key={option.id}
                        project_id={option.project_id}
                        task_id={option.id}
                    />
                </button>
            ))}
        </DropdownPicker>
    )
}

export default AddDependencyPicker;