import './EditDependenciesDropdown.css'

import DropdownPicker from "../../../../Dropdowns/DropdownPicker/DropdownPicker.tsx";
import React, {Children, PropsWithChildren} from "react";
import {useSelector} from "react-redux";
import useUpdateTask from "../../../../../hooks/useUpdateTask.ts";
import TaskIcon from "../../TaskIcon/TaskIcon.tsx";
import PlusIcon from '../../../../../assets/Icons/Plus.svg'
import MinusIcon from '../../../../../assets/Icons/Minus.svg'

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
                {depends_on.length != 0 &&
                    <ul>
                        <p className='more-tasks-dropdown-header'>Depends On:</p>
                        {depends_on.length != 0 && depends_on.map((option) => (
                            <div className='more-tasks-dropdown-row remove-from-list' key={`${option.project_id}-${option.id}`}>
                                <TaskIcon project_id={option.project_id} task_id={option.id}/>
                                <p className='task-name'>{option.name}</p>

                                <button
                                    onClick={() => {
                                        updateTask(props.project_id, props.task_id, {
                                            depends_on: task.depends_on.filter((task) => {
                                                return task.project_id != option.project_id || task.task_id != option.id
                                            })
                                        })
                                    }}
                                >
                                    <img src={MinusIcon}/>
                                </button>
                            </div>
                        ))}
                    </ul>
                }

                {options.length != 0 &&
                    <ul>
                        <p className='more-tasks-dropdown-header'>Add Tasks:</p>
                        {options
                            .filter((option) => option.project_id != task.project_id || option.id != task.id)
                            .map((option) => (
                            <div className='more-tasks-dropdown-row add-to-list' key={`${option.project_id}-${option.id}`}>
                                <TaskIcon project_id={option.project_id} task_id={option.id}/>
                                <p className='task-name'>{option.name}</p>

                                <button
                                    onClick={() => {
                                        updateTask(props.project_id, props.task_id, {
                                            depends_on: [...task.depends_on, {
                                                project_id: option.project_id,
                                                task_id: option.id
                                            }]
                                        })
                                    }}
                                >
                                    <img src={PlusIcon}/>
                                </button>
                            </div>
                        ))}
                    </ul>
                }
            </div>
        </DropdownPicker>
    )
}

export default EditDependenciesDropdown;