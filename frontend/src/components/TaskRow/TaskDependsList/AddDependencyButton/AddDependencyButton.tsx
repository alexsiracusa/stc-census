import './AddDependencyButton.css'

import PlusIcon from '../../../../assets/Icons/Plus.svg'
import {useSelector} from "react-redux";
import useUpdateTask from "../../../../hooks/useUpdateTask.ts";
import AddDependencyPicker from "./AddDependencyPicker/AddDependencyPicker.tsx";

type AddTaskDependencyButtonProps = {
    project_id: number
    task_id: number
}

const AddTaskDependencyButton = (props: AddTaskDependencyButtonProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const {updateTask, loading, error, data} = useUpdateTask()

    if (task == null) {
        return <></>
    }

    return (
        <AddDependencyPicker
            className='square-button add-dependency-button'
            title={'Add Dependency'}
            project_id={props.project_id}
            task_id={props.task_id}
        >
            <img src={PlusIcon}/>
        </AddDependencyPicker>
    )
}

export default AddTaskDependencyButton;