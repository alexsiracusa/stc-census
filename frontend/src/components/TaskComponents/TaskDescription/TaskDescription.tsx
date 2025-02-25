import './TaskDescription.css'

import {useSelector} from "react-redux";
import {useState, useRef} from "react";
import useUpdateTask from "../../../hooks/useUpdateTask.ts";
import AutoExpandingTextarea from "../../GenericComponents/AutoExpandingTextarea/AutoExpandingTextarea.tsx";

type TaskDescriptionProps = {
    project_id: number,
    task_id: number,
}

const TaskDescription = (props: TaskDescriptionProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const [editing, setEditing] = useState(false)
    const {updateTask, loading, error, data} = useUpdateTask();
    const [description, setDescription] = useState(task.description);

    const handleFocus = () => {
        setEditing(true)
    }

    return (
        <div className='description-editor'>
            <AutoExpandingTextarea
                value={description ?? ''}
                onChange={(value) => {
                    setDescription(value)
                    console.log(value)
                }}
                onFocus={handleFocus}
                placeholder='Add a description...'
                className={`description ${editing ? "editing" : "static"}`}
            />

            {editing &&
                <div className='action-items'>
                    <button
                        className='save'
                        onClick={() => {
                            updateTask(props.project_id, props.task_id, {
                                description: description
                            })
                            setEditing(false)
                        }}
                    >
                        Save
                    </button>
                    <button
                        className='cancel'
                        onClick={() => {
                            setEditing(false)
                            setDescription(task.description)
                        }}
                    >
                        Cancel
                    </button>
                </div>
            }
        </div>
    )
}

export default TaskDescription