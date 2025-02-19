import React, { useState, useEffect } from 'react';
import CalendarHeader from './CalendarHeader/CalendarHeader';
import CalendarGrid from './CalendarGrid/CalendarGrid';
import EventForm from './EventForm/EventForm';
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
};

const convertTasksToEvents = (tasks: Record<string, Task>, projectId: number): Event[] => {
    return Object.values(tasks).map((task: Task) => ({
        projectId,
        id: task.id.toString(),
        title: task.name || 'Untitled Task',
        color: TaskStatusInfo[task.status]?.color || '#003366',
        startDate: task.target_start_date || 'N/A',
        endDate: task.target_completion_date || task.target_start_date || 'N/A',
    }));
};

const Calendar: React.FC<TabProps & { project_id: number }> = (props) => {
    const { project_id } = props;
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [eventTitle, setEventTitle] = useState('');
    const [eventNote, setEventNote] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const tasks: Record<string, Task> = useSelector((state) => state.projects.byId[project_id]?.byId) || {};

    useEffect(() => {
        const taskEvents = convertTasksToEvents(tasks, project_id);
        console.log("Converted taskEvents:", taskEvents);
        setEvents(taskEvents);
    }, [tasks, project_id]);

    const handleSaveEvent = (eventData: { title: string; startDate: string; endDate: string; note: string; status: string; }) => {
        if (eventData.title && eventData.startDate && eventData.endDate) {
            if (selectedEventId) {
                setEvents((prev) =>
                    prev.map((event) =>
                        event.id === selectedEventId
                            ? { ...event, title: eventData.title, startDate: eventData.startDate, endDate: eventData.endDate }
                            : event
                    )
                );
            } else {
                setEvents((prev) => [
                    ...prev,
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        projectId: project_id,
                        title: eventData.title,
                        color: '#003366',
                        startDate: eventData.startDate,
                        endDate: eventData.endDate,
                    },
                ]);
            }
            resetForm();
        }
    };

    const handleDelete = (eventId: string) => {
        setEvents((prev) => prev.filter((event) => event.id !== eventId));
    };

    const resetForm = () => {
        setIsEventFormOpen(false);
        setSelectedEventId(null);
        setEventTitle('');
        setEventNote('');
        setStartDate('');
        setEndDate('');
    };

    const handleOpenNewEventForm = (date: Date) => {
        const formDate = date.toISOString().split('T')[0];
        setSelectedEventId(null);
        setStartDate(formDate);
        setEndDate(formDate);
        setEventTitle('');
        setEventNote('');
        setIsEventFormOpen(true);
    };

    const handleOpenEditEventForm = (event: Event) => {
        setSelectedEventId(event.id);
        setStartDate(event.startDate);
        setEndDate(event.endDate);
        setEventTitle(event.title);
        setEventNote(eventNote);
        setIsEventFormOpen(true);
    };

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
                setEvents={setEvents}
                openEventForm={handleOpenNewEventForm}
                openEditForm={handleOpenEditEventForm}
                onDeleteEvent={handleDelete}
                currentProjectId={project_id}
                editing={false}
                select={() => {}}
                project_id={project_id}
                task_id={0}
            />
            <EventForm
                isOpen={isEventFormOpen}
                onClose={() => setIsEventFormOpen(false)}
                onSaveEvent={handleSaveEvent}
                title={eventTitle}
                setTitle={setEventTitle}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                note={eventNote}
                setNote={setEventNote}
                status={'Todo'}
                setStatus={() => {}}
            />
        </div>
    );
};

export default Calendar;
