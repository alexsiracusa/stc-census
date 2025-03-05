import {useState} from "react";
import DropdownPicker from "../../Dropdowns/DropdownPicker/DropdownPicker.tsx";
import SubProjectDropdown from "./SubProjectDropdown.tsx";

type PathEditorProjectProps = {
    project_id: number
    project_name: string
    select: (number) => void
}

const PathEditorProject = (props: PathEditorProjectProps) => {
    const [isVisible, setIsVisible] = useState(false)

    const toggleDropdown = (value) => {
        props.select(props.project_id)
        setIsVisible(value)
    }

    return (
        <DropdownPicker
            icon={(<p>{props.project_name}</p>)}
            buttonClassName='link'
            contentClassName='sub-project-dropdown-container'
            containerAlignment='flex-start'
            contentAlignment='flex-start'
            title='Click to see a sub project menu'
            isVisible={isVisible}
            setIsVisible={toggleDropdown}
        >
            <SubProjectDropdown
                project_id={props.project_id}
                select={props.select}
                setIsVisible={setIsVisible}
            />
        </DropdownPicker>

    )
}

export default PathEditorProject