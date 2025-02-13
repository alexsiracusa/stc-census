import './TaskDependsEditor.css'

import TaskIcon from "../TaskIcon/TaskIcon.tsx";
import MinusIcon from "../../assets/Icons/Minus.svg";
import PlusIcon from "../../assets/Icons/Plus.svg";
import React from "react";
import useUpdateTask from "../../hooks/useUpdateTask.ts";
import {useSelector} from "react-redux";

type TaskDependsEditorProps = {
    project_id: number
    task_id: number
}


const TaskDependsEditor = (props: TaskDependsEditorProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const tasks = useSelector((state) => state.projects.byId[props.project_id].byId);
    const {updateTask, loading, error, data} = useUpdateTask();
    const depends_on = Object.values(tasks).filter((option) => task.depends_on.some((task) => task.project_id === option.project_id && task.task_id === option.id))
    const options = Object.values(tasks).filter((option) => !task.depends_on.some((task) => task.project_id === option.project_id && task.task_id === option.id))


    return (
        <div className='task-depends-editor'>
            {depends_on.length != 0 &&
                <ul>
                    <p className='task-depends-editor-header'>Depends On:</p>
                    {depends_on.length != 0 && depends_on.map((option) => (
                        <div className='task-depends-editor-row remove-from-list'
                             key={`${option.project_id}-${option.id}`}>
                            <TaskIcon project_id={option.project_id} task_id={option.id}/>
                            <p className='task-name'>{option.name}</p>

                            <button
                                title={'Remove'}
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
                    <p className='task-depends-editor-header'>Add Tasks:</p>
                    {options
                        .filter((option) => option.project_id != task.project_id || option.id != task.id)
                        .map((option) => (
                            <div className='task-depends-editor-row add-to-list'
                                 key={`${option.project_id}-${option.id}`}>
                                <TaskIcon project_id={option.project_id} task_id={option.id}/>
                                <p className='task-name'>{option.name}</p>

                                <button
                                    title={'Add'}
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
    )
}

export default TaskDependsEditor