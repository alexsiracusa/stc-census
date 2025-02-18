import '../EditingHeader.css'

import '../EditingHeader.css'
import XMark from "../../../../assets/Icons/X.svg";
import Edit from "../../../../assets/Icons/Edit2.svg";
import ConfirmPopup from "../../ConfirmPopup/ConfirmPopup.tsx";
import Trash from "../../../../assets/Icons/Trash2.svg";
import {useState} from "react";
import useDeleteProjects from "../../../../hooks/useDeleteProjects.ts";
import {useTranslation} from "react-i18next";

type TaskEditingHeaderProps = {
    editing: boolean
    setEditing: (boolean) => void
    selected: Set<number>
}

const TaskEditingHeader = (props: TaskEditingHeaderProps) => {
    // const {deleteProjects, loading, error, data} = useDeleteProjects();
    const [editing, setEditing] = useState(false)
    const {t} = useTranslation();

    return (
        <div className='editing-header'>
            <h3>{t('taskList.tasks')}</h3>

            <button
                className='edit-button'
                title={props.editing ? 'Cancel' : 'Edit'}
                onClick={() => {
                    props.selected.clear()
                    props.setEditing(!editing)
                    setEditing(!editing)
                }}
            >
                <img src={editing ? XMark : Edit}/>
            </button>

            {editing && (
                <ConfirmPopup
                    className='delete-button'
                    message='Are you sure you want to delete all selected subprojects? It better to archive them instead. This cannot be undone.'
                    left={{
                        text: 'Delete',
                        onPress: () => {
                            // deleteProjects(Array.from(props.selected.values()))
                            setEditing(false)
                            props.setEditing(false)
                        },
                        type: 'destructive',
                    }}
                    right={{
                        text: 'Cancel',
                        onPress: () => {
                            setEditing(false)
                            props.setEditing(false)
                        },
                        type: 'neutral'
                    }}
                >
                    <img src={Trash}/>
                </ConfirmPopup>
            )}
        </div>
    )
}

export default TaskEditingHeader