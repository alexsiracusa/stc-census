import '../EditingHeader.css'
import XMark from "../../../../assets/Icons/X.svg";
import Edit from "../../../../assets/Icons/Edit.svg";
import ConfirmPopup from "../../ConfirmPopup/ConfirmPopup.tsx";
import Trash from "../../../../assets/Icons/Trash.svg";
import {useState} from "react";
import useDeleteProjects from "../../../../hooks/useDeleteProjects.ts";
import {useTranslation} from "react-i18next";

type ProjectEditingHeaderProps = {
    editing: boolean
    setEditing: (boolean) => void
    selected: Set<number>
    dashboard?: boolean
}

const ProjectEditingHeader = (props: ProjectEditingHeaderProps) => {
    const {deleteProjects, loading, error, data} = useDeleteProjects();
    const [editing, setEditing] = useState(false)
    const {t} = useTranslation();

    return (
        <div className='editing-header'>
            <h3>{t(props.dashboard ? 'projectDashboard.title' : 'projectList.subProjects')}</h3>

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
                    message='Are you sure you want to delete all selected projects and related information? This cannot be undone. It is recommended to archive instead.'
                    left={{
                        text: 'Delete',
                        onPress: () => {
                            deleteProjects(Array.from(props.selected.values()))
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

export default ProjectEditingHeader