import './ProjectPath.css'

import {Link} from "react-router";
import ChevronRight from "../../assets/Icons/ChevronRight.svg";

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
            <img src={ChevronRight}/>

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
                    {index < path.length - 1 &&
                        <img src={ChevronRight}/>
                    }
                </>
            ))}
        </div>
    )
}

export default ProjectPath;