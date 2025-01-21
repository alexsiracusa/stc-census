import './ProjectDashboard.css'

import {useState, useEffect} from 'react';
import ProjectRow from "../../components/ProjectRow/ProjectRow.tsx";


const ProjectDashboard = () => {
    const [projects, setProjects] = useState(null);
    const host = import.meta.env.VITE_BACKEND_HOST;

    useEffect(() =>  {
        (async () => {
            try {
                const response = await fetch(`${host}/projects/`);
                const json = await response.json()
                if (!response.ok) return console.error(json['error']);
                setProjects(json)
            }
            catch (error) {
                console.error(error)
            }
        })();
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