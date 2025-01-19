import './ProjectPage.css'
import '../../styles/Gutters.css'

import ProjectSidebar from "../../components/ProjectSidebar/ProjectSidebar.tsx";
import ProjectView from "../../components/ProjectView/ProjectView.tsx";
import {useParams} from "react-router-dom";

const ProjectPage = () => {
    const {id} = useParams()

    if (Number.isInteger(Number(id))) {
        return (
            <div className='project-page'>
                <ProjectSidebar id={Number(id)}/>
                <ProjectView project_id={Number(id)}/>
            </div>
        )
    } else {
        return (
            <div>404</div>
        )
    }
};

export default ProjectPage;