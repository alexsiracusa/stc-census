import './ProjectPath.css'

import {Link} from "react-router";
import {Fragment} from "react";
import ChevronRight from "../../assets/Icons/ChevronRight.svg";
import { useTranslation } from 'react-i18next';

type ProjectPathProps = {
    path: [object]
}

const ProjectPath = (props: ProjectPathProps) => {
    const path = props.path;
    const { t } = useTranslation();

    return (
        <div className='project-path'>
            <Link
                reloadDocument
                to='/projects'
                className='link'
                key='projects'
            >
                <p>{t('projectPath.title')}</p>
            </Link>
            <img src={ChevronRight}/>

            {path.map((project, index) => (
                <Fragment key={index}>
                    <Link
                        reloadDocument
                        to={`/project/${project['id']}/task-list`}
                        className='link'
                    >
                        <p>{project['name']}</p>
                    </Link>
                    {index < path.length - 1 &&
                        <img src={ChevronRight}/>
                    }
                </Fragment>
            ))}
        </div>
    )
}

export default ProjectPath;