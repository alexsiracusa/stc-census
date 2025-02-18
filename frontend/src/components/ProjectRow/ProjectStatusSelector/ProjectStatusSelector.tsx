import './ProjectStatusSelector.css'

import {ProjectStatusInfo, ProjectStatuses} from "../../../types/ProjectStatus.ts";
import StatusSelector from "../../StatusSelector/StatusSelector.tsx";
import {useSelector} from "react-redux";
import useUpdateProject from "../../../hooks/useUpdateProject.ts";


type ProjectStatusSelectorProps = {
    project_id: number
}

const ProjectStatusSelector = (props: ProjectStatusSelectorProps) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const {updateProject, loading, error, data} = useUpdateProject();

    const handleUpdate = (status) => {
        updateProject(props.project_id, {status: status});
    };

    const selected = {
        value: project.status,
        displayName: ProjectStatusInfo[project.status].name,
        color: ProjectStatusInfo[project.status].color
    }

    const options = ProjectStatuses.map((status: string) => ({
        value: status,
        displayName: ProjectStatusInfo[status].name,
        color: ProjectStatusInfo[status].color
    }))

    return (
        <StatusSelector value={selected} options={options} onChange={handleUpdate}/>
    )
};

export default ProjectStatusSelector;