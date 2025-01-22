import './EVM.css'
import { useTranslation } from 'react-i18next'

import TabProps from "../TabProps.ts";

const EVM = (props: TabProps) => {
    const {t} = useTranslation();

    return (
        <div>{t('EVM.title')} {props.project['id']}</div>
    )
};

export default EVM;