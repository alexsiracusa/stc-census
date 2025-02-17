import './ProjectName.css'

import {useSelector} from "react-redux";
import useUpdateTask from "../../../hooks/useUpdateTask.ts";
import NameEditor from "../../NameEditor/NameEditor.tsx";

type ProjectNameProps = {
    project_id: number
}

const ProjectName = (props: ProjectNameProps) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const {updateTask, loading, error, data} = useUpdateTask();

    const setName = (name) => {
        // updateTask(props.project_id, props.task_id, {
        //     name: name
        // })
    }

    return (
        <NameEditor name={project.name} setName={setName}/>
    )
}

export default ProjectName