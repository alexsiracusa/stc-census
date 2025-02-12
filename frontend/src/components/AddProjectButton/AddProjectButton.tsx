import './AddProjectButton.css'

import Plus from '../../assets/Icons/Plus.svg'
import {useRef, useState} from "react";
import useCreateProject from "../../hooks/useCreateProject.ts";
import {useTranslation} from "react-i18next";

type AddTaskButtonProps = {
    project_id: number | undefined
}

const AddProjectButton = (props: AddTaskButtonProps) => {
    const [name, setName] = useState("")
    const {createProject, loading, error, data} = useCreateProject();
    const ref = useRef(null);
    const {t} = useTranslation();

    const enterInput = () => {
        if (name !== "") {
            createProject({
                parent: props.project_id,
                name: name
            })
            setName("")
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            enterInput()
        }
    };

    const handleButton = () => {
        ref.current.focus()
    }

    return (
        <div className='add-project-button'>
            <div className='icon-container'>
                <div
                    className='icon'
                    onClick={handleButton}
                >
                    <img src={Plus}/>
                </div>
            </div>
            <input
                ref={ref}
                type="text"
                placeholder={t('addProject')}
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={enterInput}
            />
        </div>
    )
}

export default AddProjectButton;