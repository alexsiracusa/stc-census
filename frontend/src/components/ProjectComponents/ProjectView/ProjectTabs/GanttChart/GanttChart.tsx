import React from 'react';
import './GanttChart.css';

import GanttBody from "./GanttBody/GanttBody.tsx";
import { useSelector } from 'react-redux';

import TabProps from "../TabProps.ts";
import { Task } from "../../../../../types/Task.ts";
import { useState } from 'react';

class ErrorBoundary extends React.Component<{ fallback: React.ReactNode; children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('GanttBody error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

const GanttChart = (props: TabProps) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const tasks = project?.byId as Record<string, Task> | undefined;
    const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);

    if (!project) {
        return <div className="gantt-chart-error">Error: Project not found.</div>;
    }

    if (!tasks) {
        return <div className="gantt-chart-error">Error: Unable to load tasks for this project.</div>;
    }

    const sortedTasks: Task[] = Object.values(tasks).sort((a, b) => {
        return Date.parse(a.target_start_date) - Date.parse(b.target_start_date);
    });

    return (
        <div className='gantt-chart'>
            <ErrorBoundary fallback={<div className="gantt-error-message">An error occurred while rendering the Gantt chart.</div>}>
                <GanttBody data={sortedTasks} dateRange={dateRange} />
            </ErrorBoundary>
        </div>
    )
};

export default GanttChart;
