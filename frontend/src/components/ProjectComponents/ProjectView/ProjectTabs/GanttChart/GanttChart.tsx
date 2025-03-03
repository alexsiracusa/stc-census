import './GanttChart.css'

import GanttBody from "./GanttBody/GanttBody.tsx";
import { useSelector } from 'react-redux';

import TabProps from "../TabProps.ts";
import {Task} from "../../../../../types/Task.ts";
import { useState } from 'react';

const GanttChart = (props: TabProps) => {
    const tasks = useSelector((state) => state.projects.byId[props.project_id].byId) as Record<string, Task>;
    const sortedTasks: Task[] = Object.values(tasks).sort((a: any, b: any) => {
        return Date.parse(a.target_start_date) - Date.parse(b.target_start_date);
    });
    const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);

    return (
        <div className='gantt-chart'>
            <GanttBody data={sortedTasks} dateRange={dateRange} />
        </div>
    )
};

export default GanttChart;