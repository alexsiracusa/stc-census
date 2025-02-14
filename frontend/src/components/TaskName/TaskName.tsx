import './TaskName.css'
import {useSelector} from "react-redux";
import {useRef, useState} from "react";
import useUpdateTask from "../../hooks/useUpdateTask.ts";
import {useEffect} from "react";

type TaskNameProps = {
    project_id: number,
    task_id: number
}

const TaskName = (props: TaskNameProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const {updateTask, loading, error, data} = useUpdateTask();
    const [name, setName] = useState(task.name)
    const ref = useRef(null);

    useEffect(() => {
        setName(task.name)
    }, [task.name]);

    const enterInput = () => {
        if (name !== "") {
            updateTask(props.project_id, props.task_id, {
                name: name
            })
            setName(name)
        } else {
            setName(task.name)
        }
        ref.current.blur()
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            enterInput()
        }
    };

    return (
        <div className='task-name-editor'>
            <input
                ref={ref}
                type="text"
                placeholder="Must give a name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={enterInput}
            />
        </div>
    )
}

export default TaskName