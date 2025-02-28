import '../EditingHeader.css'
import ConfirmPopup from "../../ConfirmPopup/ConfirmPopup.tsx";
import {useState} from "react";
import useDeleteProjects from "../../../../hooks/useDeleteProjects.ts";
import {useTranslation} from "react-i18next";

import XMark from "../../../../assets/Icons/X.svg";
import Edit from "../../../../assets/Icons/Edit.svg";
import Trash from "../../../../assets/Icons/Trash.svg";
import Archive from "../../../../assets/Icons/Archive.svg"

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
                <>
                    <ConfirmPopup
                        className='archive-button'
                        title='Archive'
                        message='Are you sure you want to archive all selected projects and related information?'
                        left={{
                            text: 'Archive',
                            onPress: () => {
                                // archive projects
                                setEditing(false)
                                props.setEditing(false)
                            },
                            type: 'safe',
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
                        <img src={Archive}/>
                    </ConfirmPopup>

                    <ConfirmPopup
                        className='delete-button'
                        title='Delete'
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
                </>
            )}
        </div>
    )
}

export default ProjectEditingHeader