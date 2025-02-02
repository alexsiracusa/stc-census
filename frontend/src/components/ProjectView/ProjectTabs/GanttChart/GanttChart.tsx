import './GanttChart.css'
import { useTranslation} from "react-i18next";

import TabProps from "../TabProps.ts";

const GanttChart = (props: TabProps) => {
    const {t} = useTranslation();

    return (
        <div>{t('ganttChart.title')} {props.project_id}</div>
    )
};

export default GanttChart;