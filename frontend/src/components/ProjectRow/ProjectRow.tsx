import './ProjectRow.css'

import {Link} from "react-router";
import {useSelector} from "react-redux";
import useFetchProjectSummary from "../../hooks/useFetchProjectSummary.ts";

type ProjectRowProps = {
    project_id: number
}

const ProjectRow = (props: ProjectRowProps) => {
    const { loading, error } = useFetchProjectSummary(props.project_id);
    const project = useSelector((state) => state.projectSummaries[props.project_id]);

    if (error) return <p>Error: {error.toString()}</p>;
    if (loading || project === undefined) return <p>Loading</p>;

    return (
        <Link
            reloadDocument
            to={`/project/${props.project_id}/task-list`}
            className='project-row'
        >
            <div className='project-id'>P{project.id}</div>
            <div className='project-name'>{project.name}</div>
        </Link>
    )
};

export default ProjectRow;