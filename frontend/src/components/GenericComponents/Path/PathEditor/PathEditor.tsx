import '../Path.css'

import {Fragment} from "react";
import ChevronRight from "../../../../assets/Icons/ChevronRight.svg";
import DropdownRowPicker from "../../Dropdowns/DropdownRowPicker/DropdownRowPicker.tsx";
import {useSelector} from "react-redux";
import DropdownPickerOption from "../../Dropdowns/DropdownPicker/DropdownPickerOption.tsx";

type PathEditorProps = {
    path: [{
        id: number,
        name: string
    }]
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
                        onChange={(value) => {

                        }}
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
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    if (project === undefined || project.sub_projects === null) {
        console.log(project)
        return <div>Loading</div>
    }

    return (
        project.sub_projects.map((subProject) => (
            <DropdownPickerOption value={subProject.id} className=''>
                {subProject.name}
            </DropdownPickerOption>
        ))
    )
}

export default PathEditor;