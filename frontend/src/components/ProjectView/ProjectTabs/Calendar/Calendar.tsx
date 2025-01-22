import './Calendar.css'
import { useTranslation } from 'react-i18next';

import TabProps from "../TabProps.ts";

const Calendar = (props: TabProps) => {
    const { t } = useTranslation();

    return (
        <div>
            {t('calendar.title')} {props.project['id']}
        </div>
    )
};

export default Calendar;