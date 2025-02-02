import './Summary.css'
import { useTranslation } from 'react-i18next';

import TabProps from "../TabProps.ts";

const Summary = (props: TabProps) => {
    const { t } = useTranslation();

    return (
        <div>
            {t('summary.title')} {props.project_id}
        </div>
    )
};

export default Summary;