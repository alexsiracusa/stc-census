import './ProjectPath.css'

import {useTranslation} from 'react-i18next';
import {useSelector} from "react-redux";
import PathPicker from "../../GenericComponents/Path/PathPicker/PathPicker.tsx";

type ProjectPathProps = {
    project_id: number
}

const ProjectPath = (props: ProjectPathProps) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const {t} = useTranslation();

    const path = [{
        name: t('projectPath.title'),
        link: '/projects'
    }].concat(project.path.map((project) => ({
        name: project.name,
        link: `/project/${project.id}/task-list`
    })));

    return (
        <PathPicker path={path}/>
    )
}

export default ProjectPath;