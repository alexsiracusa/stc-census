import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import EventForm from './EventForm';
import getCalendarDays from "../../../../utils/getCalendarDays.ts";
import './Calendar.css';

export type Event = {
    id: string;
    title: string;
    date: string;
    color: string;
};

const Calendar: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');

    const formatDateToLocalString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSaveEvent = () => {
        if (eventTitle && selectedDate) {
            setEvents((prev) => [
                ...prev,
                { id: Math.random().toString(36).substr(2, 9), title: eventTitle, date: selectedDate, color: '#003366' },
            ]);
            setIsEventFormOpen(false);
        }
    };

    const handleOpenEventForm = (date: Date) => {
        setSelectedDate(formatDateToLocalString(date));
        setEventTitle('');
        setEventDescription('');
        setIsEventFormOpen(true);
    };

    return (
        <div className="calendar-container">
            <CalendarHeader
                currentMonth={currentMonth}
                onNavigate={(dir) => {
                    const nextMonth = new Date(currentMonth);
                    nextMonth.setMonth(nextMonth.getMonth() + dir);
                    setCurrentMonth(nextMonth);
                }}
                onResetToToday={() => setCurrentMonth(new Date())}
            />
            <CalendarGrid
                calendarDays={getCalendarDays(currentMonth)}
                events={events}
                openEventForm={handleOpenEventForm}
                openAllEventsOverlay={() => {}}
            />
            <EventForm
                isOpen={isEventFormOpen}
                onClose={() => setIsEventFormOpen(false)}
                onSaveEvent={handleSaveEvent}
                title={eventTitle}
                setTitle={setEventTitle}
                date={selectedDate}
                setDate={setSelectedDate}
                description={eventDescription}
                setDescription={setEventDescription}
            />
        </div>
    );
};

export default Calendar;
