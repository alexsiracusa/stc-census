import './ProjectPath.css'
import ProjectRow from "../ProjectRow/ProjectRow.tsx";

type ProjectPathProps = {
    path: [object]
}

const ProjectPath = (props: ProjectPathProps) => {
    const path = props.path;

    return (
        <div className='project-path'>
            {path.map((project) => (
                <div key={project['id']}>
                    {project['name']}
                </div>
            ))}
        </div>
    )
}

export default ProjectPath;