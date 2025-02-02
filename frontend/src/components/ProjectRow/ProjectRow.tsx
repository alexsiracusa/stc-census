import './ProjectRow.css'

import {Link} from "react-router";
import {useSelector} from "react-redux";

type ProjectRowProps = {
    project_id: number
}

const ProjectRow = (props: ProjectRowProps) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);

    return (
        <Link
            reloadDocument
            to={`/project/${project['id']}/task-list`}
            className='project-row'
        >
            <div className='project-id'>P{project['id']}</div>
            <div className='project-name'>{project['name']}</div>
        </Link>
    )
};

export default ProjectRow;