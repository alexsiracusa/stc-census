import './ProjectDashboard.css'

import { Link } from "react-router";
import { useState, useEffect } from 'react';


const ProjectDashboard = () => {
    const [projects, setProjects] = useState(null);
    const host = import.meta.env.VITE_BACKEND_HOST;

    useEffect(() => {
        fetch(`${host}/projects/`)
            .then(response => response.json())
            .then(json => {setProjects(json)})
            .catch(error => console.error(error));
    }, []);

    return (
        <div className='project-dashboard'>
            {projects !== null && (
                <div className='project-list'>
                    {projects.map((project) => (
                        <Link
                            to={`/project/${project['id']}/summary`}
                            className='project-row'
                        >
                            {project['name']}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
};

export default ProjectDashboard;