import './TaskDescription.css'

import {useSelector} from "react-redux";
import {useState, useRef} from "react";
import useUpdateTask from "../../../hooks/useUpdateTask.ts";

type TaskDescriptionProps = {
    project_id: number,
    task_id: number,
}

const TaskDescription = (props: TaskDescriptionProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const {updateTask, loading, error, data} = useUpdateTask();
    const [description, setDescription] = useState("");
    const ref = useRef(null);

    const handleInput = (e) => {
        setDescription(e.target.textContent);

        const children = ref.current.childNodes;
        if (children.length === 1 && children[0].nodeName === "BR") {
            ref.current.innerHTML = ""; // Clean out <br>
        }
    };

    const handleBlur = () => {
        if (ref.current.textContent.trim() === "") {
            setDescription("");
            ref.current.classList.add("placeholder");
            ref.current.innerHTML = "";
        }
        updateTask(props.project_id, props.task_id, {
            description: description.trim()
        })
    };


    return (
        <div className='task-description'>
            <div
                ref={ref}
                className={`description ${!description.trim() ? "placeholder" : ""}`}
                onInput={handleInput}
                onBlur={handleBlur}
                contentEditable={true}
                aria-placeholder="Enter a description..."
                suppressContentEditableWarning={true}
            >
                {task.description}
            </div>
        </div>
    )
}

export default TaskDescription