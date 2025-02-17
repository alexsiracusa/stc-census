import './TaskName.css'

import {useSelector} from "react-redux";
import useUpdateTask from "../../../hooks/useUpdateTask.ts";
import NameEditor from "../../NameEditor/NameEditor.tsx";

type TaskNameProps = {
    project_id: number,
    task_id: number
}

const TaskName = (props: TaskNameProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const {updateTask, loading, error, data} = useUpdateTask();

    const setName = (name) => {
        updateTask(props.project_id, props.task_id, {
            name: name
        })
    }

    return (
        <NameEditor name={task.name} setName={setName}/>
    )
}

export default TaskName