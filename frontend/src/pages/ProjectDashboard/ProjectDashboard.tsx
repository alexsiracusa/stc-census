import './ProjectDashboard.css'

import {useState, useEffect} from 'react';
import ProjectRow from "../../components/ProjectRow/ProjectRow.tsx";


const ProjectDashboard = () => {
    const [projects, setProjects] = useState(null);
    const host = import.meta.env.VITE_BACKEND_HOST;

    useEffect(() => {
        fetch(`${host}/projects/`)
            .then(response => response.json())
            .then(json => {
                setProjects(json)
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <div className='project-dashboard'>
            <h3>Project Dashboard</h3>

            {projects !== null && (
                <ul className='project-list'>
                    {projects.map((project) => (
                        <li key={project['id']}>
                            <ProjectRow project={project}/>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
};

export default ProjectDashboard;