import {useState} from "react";
import {useSelector} from "react-redux";
import DropdownPicker from "../../Dropdowns/DropdownPicker/DropdownPicker.tsx";
import SubProjectDropdown from "./SubProjectDropdown.tsx";

type PathEditorProjectProps = {
    project_id: number
    project_name: string
    select: (number) => void
}

const PathEditorProject = (props: PathEditorProjectProps) => {
    const [isVisible, setIsVisible] = useState(false)
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    if (!project || !project.sub_projects) {
        return <div>Loading</div>
    }

    return (
        <DropdownPicker
            icon={(<p>{props.project_name}</p>)}
            buttonClassName='link'
            contentClassName=''
            containerAlignment='flex-start'
            contentAlignment='flex-start'
            title=''
            isVisible={isVisible}
            setIsVisible={setIsVisible}
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