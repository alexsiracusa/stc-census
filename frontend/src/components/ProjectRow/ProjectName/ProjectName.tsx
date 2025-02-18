import './ProjectName.css'

import {useSelector} from "react-redux";
import useUpdateProject from "../../../hooks/useUpdateProject.ts";
import NameEditor from "../../NameEditor/NameEditor.tsx";

type ProjectNameProps = {
    project_id: number
}

const ProjectName = (props: ProjectNameProps) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const {updateProject, loading, error, data} = useUpdateProject();

    const setName = (name) => {
        updateProject(props.project_id, {
            name: name
        })
    }

    return (
        <NameEditor name={project.name} setName={setName}/>
    )
}

export default ProjectName