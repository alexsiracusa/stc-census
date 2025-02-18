import './TaskDeleteButton.css'

import {useState} from "react";
import useDeleteTask from "../../../hooks/useDeleteTask.ts";
import Trash from '../../../assets/Icons/Trash2.svg'
import ConfirmPopup from "../../GenericComponents/ConfirmPopup/ConfirmPopup.tsx";

type TaskDeleteButtonProps = {
    project_id: number,
    task_id: number,
    onDelete?: () => void;
}

const TaskDeleteButton = (props: TaskDeleteButtonProps) => {
    const {deleteTask, loading, error, data} = useDeleteTask()

    return (
        <ConfirmPopup
            className='task-delete-button'
            message='Are you sure you want to delete this task? This cannot be undone.'
            left={{
                text: 'Delete',
                onPress: () => {
                    if (props.onDelete) {
                        props.onDelete()
                    }
                    deleteTask(props.project_id, props.task_id)
                },
                type: 'destructive',
            }}
            right={{
                text: 'Cancel',
                onPress: () => {},
                type: 'neutral'
            }}
        >
            <img src={Trash}/>
        </ConfirmPopup>
    )
}

export default TaskDeleteButton