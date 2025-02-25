import './GanttChart.css'
import { useTranslation } from "react-i18next";
import GanttBody from "./GanttBody.tsx";
import { useSelector } from 'react-redux';
// import { TaskStatusInfo } from "../../../../types/TaskStatuses.ts";

import TabProps from "../TabProps.ts";
import { Task } from '../../../../types/Task.ts';
import { useState } from 'react';

const GanttChart = (props: TabProps) => {
    const { t } = useTranslation();
    const tasks = useSelector((state: any) => state.projects.byId[props.project_id].byId) as Record<string, Task>;
    const sortedTasks: Task[] = Object.values(tasks).sort((a: any, b: any) => {
        return Date.parse(a.target_start_date) - Date.parse(b.target_start_date);
    });
    const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);

    const chartFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value;
        console.log(selectedDate);

        if (!selectedDate) {
            setDateRange(null);
            return;
        }

        const year = selectedDate.substring(0, 4);
        const month = selectedDate.substring(5, 7);
        const lastDay = (y: number, m: number) => {
            return new Date(y, m, 0).getDate();
        };

        const startDate = `${year}-${month}-01`;
        const endDate = `${year}-${month}-${lastDay(parseInt(year), parseInt(month))}`;

        // Update the date range state
        setDateRange({ startDate, endDate });
    };

    return (
        <div>
            {t('ganttChart.title')} {props.project_id}
            <div style={{ display: 'flex', justifyContent: 'right', gap: '10px' }}>
                <label htmlFor='month'>Filter by Month: </label>
                <input type='month' onChange={chartFilter} />
            </div>
            <div style={{ overflow: 'auto' }}>
                <GanttBody data={sortedTasks} dateRange={dateRange} />
            </div>
        </div>

    )
};

export default GanttChart;