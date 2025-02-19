import './Summary.css'
import { useTranslation } from 'react-i18next';

import TabProps from "../TabProps.ts";
import ProjectName from "../../../ProjectRow/ProjectName/ProjectName.tsx";

const Summary = (props: TabProps) => {
    const { t } = useTranslation();

    return (
        <div>
            {t('summary.title')} {props.project_id}
            <ProjectName project_id={props.project_id}/>
        </div>
    )
};

export default Summary;