import './Project.css'
import '../../styles/Gutters.css'

import ProjectSidebar from "../../components/ProjectSidebar/ProjectSidebar.tsx";
import ProjectView from "../../components/ProjectView/ProjectView.tsx";

const ProjectPage = () => {
    return (
        <div className='project-page'>
            <ProjectSidebar/>
            <ProjectView/>
        </div>
    )
};

export default ProjectPage;