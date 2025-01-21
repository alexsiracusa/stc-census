import './ProjectPath.css'

import {Link} from "react-router";

type ProjectPathProps = {
    path: [object]
}

const ProjectPath = (props: ProjectPathProps) => {
    const path = props.path;

    return (
        <div className='project-path'>
            <Link
                reloadDocument
                to='/projects'
                className='link'
            >
                Projects
            </Link>
            <>{">"}</>

            {path.map((project, index) => (
                <>
                    <Link
                        reloadDocument
                        to={`/project/${project['id']}/task-list`}
                        key={project['id']}
                        className='link'
                    >
                        {project['name']}
                    </Link>
                    {index < path.length - 1 && " >"}
                </>
            ))}
        </div>
    )
}

export default ProjectPath;