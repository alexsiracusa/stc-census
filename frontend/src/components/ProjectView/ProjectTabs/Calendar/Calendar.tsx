import React, { useState } from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import EventForm from './EventForm';
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

    const getStartOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
    const getEndOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const generateCalendarDays = () => {
        const startOfMonth = getStartOfMonth(currentMonth);
        const endOfMonth = getEndOfMonth(currentMonth);
        const days = [];
        const firstDayOfWeek = startOfMonth.getDay();

        for (let i = 0; i < firstDayOfWeek; i++) {
            const prevDay = new Date(startOfMonth);
            prevDay.setDate(prevDay.getDate() - firstDayOfWeek + i);
            days.push({ date: prevDay, isCurrentMonth: false });
        }

        for (let i = 1; i <= endOfMonth.getDate(); i++) {
            days.push({
                date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
                isCurrentMonth: true,
            });
        }

        const remainingDays = (7 - (days.length % 7)) % 7;
        const lastDay = new Date(endOfMonth);
        for (let i = 1; i <= remainingDays; i++) {
            const nextDay = new Date(lastDay);
            nextDay.setDate(lastDay.getDate() + i);
            days.push({ date: nextDay, isCurrentMonth: false });
        }

        return days;
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
        setSelectedDate(date.toISOString().split('T')[0]);
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
                calendarDays={generateCalendarDays()}
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
