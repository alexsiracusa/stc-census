import './ProjectRow.css'

import {Link} from "react-router";
import {useSelector} from "react-redux";
import useFetchProjectSummary from "../../hooks/useFetchProjectSummary.ts";
import ProjectName from "./ProjectName/ProjectName.tsx";

type ProjectRowProps = {
    project_id: number
}

const ProjectRow = (props: ProjectRowProps) => {
    const { loading, error } = useFetchProjectSummary(props.project_id);
    const project = useSelector((state) => state.projects.byId[props.project_id]);

    if (error) return <p>Error: {error.toString()}</p>;
    if (loading || project === undefined) return <p>Loading</p>;

    return (
        <div className='project-row'>
            <Link
                reloadDocument
                to={`/project/${props.project_id}/task-list`}
                className='project-id'
            >
                <p>P{project.id}</p>
            </Link>

            <div className='project-name-container'>
                <ProjectName project_id={props.project_id}/>
            </div>
        </div>
    )
};

export default ProjectRow;