import { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader/CalendarHeader';
import CalendarGrid from './CalendarGrid/CalendarGrid';
import getCalendarDays from "../../../../../utils/getCalendarDays.ts";
import './Calendar.css';
import { useSelector } from "react-redux";
import { Task } from "../../../../../types/Task.ts";
import { TaskStatusInfo } from "../../../../../types/TaskStatuses.ts";

export type Event = {
    project_id: number;
    id: number;
    title: string;
    color: string;
    startDate: string;
    endDate: string;
    status: string;
};

const convertTasksToEvents = (tasks: Record<string, Task>, projectId: number): Event[] => {
    return Object.values(tasks).map((task: Task) => ({
        project_id: projectId,
        id: task.id,
        title: task.name || 'Untitled Task',
        color: TaskStatusInfo[task.status]?.color || '#003366',
        startDate: task.target_start_date || 'N/A',
        endDate: task.target_completion_date || task.target_start_date || 'N/A',
        status: task.status || 'N/A'
    }));
};

const Calendar = (props: { project_id: number }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);

    const tasks: Record<string, Task> = useSelector((state) => state.projects.byId[props.project_id].byId) || {};

    useEffect(() => {
        const taskEvents = convertTasksToEvents(tasks, props.project_id);
        setEvents(taskEvents);
    }, [tasks, props.project_id]);

    const setMonth = (dir: number) => {
        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + dir, 1);
        setCurrentMonth(nextMonth);
    };

    return (
        <div className="calendar-container">
            <CalendarHeader
                currentMonth={currentMonth}
                onNavigate={setMonth}
                onResetToToday={() => setCurrentMonth(new Date())}
            />
            <CalendarGrid
                calendarDays={getCalendarDays(currentMonth)}
                events={events}
                currentProjectId={props.project_id}
                editing={false}
            />
        </div>
    );
};

export default Calendar;
