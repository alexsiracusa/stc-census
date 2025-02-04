import './TaskDependsList.css'

import PlusIcon from '../../../assets/Icons/Plus.svg'
import {useSelector} from "react-redux";
import useUpdateTaskDependsOn from "../../../hooks/useUpdateTaskDependsOn.ts";

type AddTaskDependencyButtonProps = {
    project_id: number
    task_id: number
}

const AddTaskDependencyButton = (props: AddTaskDependencyButtonProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const {updateTaskDependsOn, loading, error, data} = useUpdateTaskDependsOn()

    if (task == null) {
        return <></>
    }

    const handleUpdate = () => {
        const dependencies = task.depends_on.concat([{
            "task_id": 2,
            "project_id": 1
        }])
        updateTaskDependsOn(props.project_id, props.task_id, dependencies);
    };

    return (
        <button
            className='add-dependency-button'
            title={`Add Dependency`}
            key={task.id}
            onClick={(event) => {
                event.stopPropagation()
                handleUpdate()
            }}
        >
            <img src={PlusIcon}/>
        </button>
    )
}

export default AddTaskDependencyButton;