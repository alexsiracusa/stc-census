import '../Path.css'
import './PathEditor.css'

import {Fragment} from "react";
import ChevronRight from "../../../../assets/Icons/ChevronRight.svg";
import DropdownRowPicker from "../../Dropdowns/DropdownRowPicker/DropdownRowPicker.tsx";
import {useSelector} from "react-redux";
import DropdownPickerOption from "../../Dropdowns/DropdownPicker/DropdownPickerOption.tsx";
import useFetchProject from "../../../../hooks/useFetchProject.ts";

type PathEditorProps = {
    path: [{
        id: number,
        name: string
    }]
    select: (number) => void
}

const PathEditor = (props: PathEditorProps) => {

    return (
        <div className='project-path'>
            {props.path.map((item, index) => (
                <Fragment key={index}>
                    <DropdownRowPicker
                        icon={(
                            <p>{item.name}</p>
                        )}
                        className='link'
                        title=''
                        onChange={props.select}
                    >
                        {PathEditorSubProjects({project_id: item.id})}
                    </DropdownRowPicker>

                    {index < props.path.length - 1 &&
                        <img src={ChevronRight}/>
                    }
                </Fragment>
            ))}
        </div>
    )
}

type PathEditorSubProjectsProps = {
    project_id: number
}

const PathEditorSubProjects = (props: PathEditorSubProjectsProps) => {
    const {loading, error} = useFetchProject(props.project_id);
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    if (project === undefined || project.sub_projects === null) {
        return <div>Loading</div>
    }

    return (
        project.sub_projects.length === 0 ? (
            <div className='sub-project-row'>
                <p>No Subprojects</p>
            </div>
        ) : (
            project.sub_projects.map((subProject) => (
                <DropdownPickerOption key={subProject.id} value={subProject.id} className='sub-project-row clickable'>
                    <p>{subProject.name}</p>
                </DropdownPickerOption>
            ))

        )

    )
}

export default PathEditor;