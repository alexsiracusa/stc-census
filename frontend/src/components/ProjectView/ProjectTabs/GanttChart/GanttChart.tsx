import './GanttChart.css'
import { useTranslation } from "react-i18next";
import GanttBody from "./GanttBody.tsx";
import { useSelector } from 'react-redux';
import { TaskStatusInfo } from "../../../../types/TaskStatuses.ts";

import TabProps from "../TabProps.ts";
import { Task } from '../../../../types/Task.ts';

const GanttChart = (props: TabProps) => {
    const { t } = useTranslation();
    const tasks = useSelector((state: any) => state.projects.byId[props.project_id].byId) as Record<string, Task>;
    const sortedTasks: Task[] = Object.values(tasks).sort((a: any, b: any) => {
        return Date.parse(a.target_start_date) - Date.parse(b.target_start_date);
    });

    return (
        <div>
            {t('ganttChart.title')} {props.project_id}
            <div className="chart-legend">
                <ul>
                    <div className="legend-container">
                        {Object.keys(TaskStatusInfo).map((status) => (
                            <div key={status} className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: TaskStatusInfo[status].color }}></span>
                                <span className="legend-text">{TaskStatusInfo[status].name}</span>
                            </div>
                        ))}
                    </div>
                </ul>
            </div>
            <GanttBody data={sortedTasks} />
        </div>

    )
};

export default GanttChart;