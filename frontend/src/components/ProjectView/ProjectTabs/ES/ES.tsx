import './ES.css'
import { useTranslation } from 'react-i18next'

import TabProps from "../TabProps.ts";

const ES = (props: TabProps) => {
    const {t} = useTranslation();

    return (
        <div>{t('ES.title')} {props.project_id}</div>
    )
};

export default ES;