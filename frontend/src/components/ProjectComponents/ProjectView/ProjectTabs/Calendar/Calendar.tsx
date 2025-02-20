import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader/CalendarHeader';
import CalendarGrid from './CalendarGrid/CalendarGrid';
import getCalendarDays from "../../../../../utils/getCalendarDays.ts";
import './Calendar.css';
import TabProps from "../TabProps.ts";
import { useSelector } from "react-redux";
import { Task } from "../../../../../types/Task.ts";
import { TaskStatusInfo } from "../../../../../types/TaskStatuses.ts";

export type Event = {
    projectId: number;
    id: string;
    title: string;
    color: string;
    startDate: string;
    endDate: string;
    status: string;
};

const convertTasksToEvents = (tasks: Record<string, Task>, projectId: number): Event[] => {
    return Object.values(tasks).map((task: Task) => ({
        projectId,
        id: task.id.toString(),
        title: task.name || 'Untitled Task',
        color: TaskStatusInfo[task.status]?.color || '#003366',
        startDate: task.target_start_date || 'N/A',
        endDate: task.target_completion_date || task.target_start_date || 'N/A',
        status: task.status || 'N/A'
    }));
};

const Calendar: React.FC<TabProps & { project_id: number }> = (props) => {
    const { project_id } = props;
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);

    const selectedEvents = new Set<string>();

    const tasks: Record<string, Task> = useSelector((state) => state.projects.byId[project_id]?.byId) || {};

    useEffect(() => {
        const taskEvents = convertTasksToEvents(tasks, project_id);
        setEvents(taskEvents);
    }, [tasks, project_id]);


    const setMonth = (dir: number) => {
        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + dir, 1);
        setCurrentMonth(nextMonth);
    };

    const toggleSelectEvent = (eventId: string) => {
        if (selectedEvents.has(eventId)) {
            selectedEvents.delete(eventId);
        } else {
            selectedEvents.add(eventId);
        }
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
                currentProjectId={project_id}
                editing={false}
                select={toggleSelectEvent}
            />
        </div>
    );
};

export default Calendar;
