import './ProjectDashboard.css'

import ProjectRow from "../../components/ProjectRow/ProjectRow.tsx";
import { useTranslation } from "react-i18next";
import {useSelector} from "react-redux";
import useFetchDashboard from "../../hooks/useFetchDashboard.ts";


const ProjectDashboard = () => {
    const {loading, error } = useFetchDashboard()
    const project_ids = useSelector((state) => state.projects.dashboard);
    const { t } = useTranslation();

    if (error) return <p>Project Dashboard Error: {error.toString()}</p>;
    if (loading || project_ids === undefined) return <p>{t('projectView.loading')}</p>;

    return (
        <div className='project-dashboard'>
            <h3>{t('projectDashboard.title')}</h3>

            {project_ids !== null && (
                <ul className='project-list'>
                    {project_ids.map((project_id) => (
                        <li key={project_id}>
                            <ProjectRow project_id={project_id}/>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
};

export default ProjectDashboard;