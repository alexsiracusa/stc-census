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
            {project['name']}
        </Link>
    )
};

export default ProjectRow;