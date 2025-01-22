import './ProjectRow.css'

import {Link} from "react-router";

type ProjectRowProps = {
    project: object
}

const ProjectRow = (props: ProjectRowProps) => {
    const project = props.project;

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