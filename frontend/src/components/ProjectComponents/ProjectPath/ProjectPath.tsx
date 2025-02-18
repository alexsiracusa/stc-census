import './ProjectPath.css'

import {Link} from "react-router";
import {Fragment} from "react";
import ChevronRight from "../../../assets/Icons/ChevronRight.svg";
import {useTranslation} from 'react-i18next';
import {useSelector} from "react-redux";
import Path from "../../GenericComponents/Path/Path.tsx";

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
        <Path path={path}/>
    )
}

export default ProjectPath;