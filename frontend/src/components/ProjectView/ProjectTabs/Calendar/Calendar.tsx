import React, {useState} from 'react';
import CalendarHeader from './CalendarHeader/CalendarHeader.tsx';
import CalendarGrid from './CalendarGrid/CalendarGrid.tsx';
import EventForm from './EventForm/EventForm.tsx';
import getCalendarDays from '../../../../utils/getCalendarDays.ts';
import './Calendar.css';

export type Event = {
    id: string;
    title: string;
    color: string;
    startDate: string;
    endDate: string;
    note: string;
};

const Calendar: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [eventTitle, setEventTitle] = useState('');
    const [eventNote, setEventNote] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const formatDateToLocalString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSaveEvent = (eventData: {
        title: string;
        startDate: string;
        endDate: string;
        note: string;
    }) => {
        if (eventData.title && eventData.startDate && eventData.endDate) {
            if (selectedEventId) {
                setEvents((prev) =>
                    prev.map((event) =>
                        event.id === selectedEventId
                            ? {
                                ...event,
                                title: eventData.title,
                                startDate: eventData.startDate,
                                endDate: eventData.endDate,
                                note: eventData.note,
                            }
                            : event
                    )
                );
            } else {
                setEvents((prev) => [
                    ...prev,
                    {
                        id: Math.random().toString(36).substr(2, 9),
                        title: eventData.title,
                        color: '#003366',
                        startDate: eventData.startDate,
                        endDate: eventData.endDate,
                        note: eventData.note,
                    },
                ]);
            }
            resetForm();
        }
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
        const formDate = formatDateToLocalString(date);
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
        setEventNote(event.note);
        setIsEventFormOpen(true);
    };

    const setMonth = (dir: number) => {
        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + dir, 1);
        setCurrentMonth(nextMonth);
    }

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
            />
        </div>
    );
};

export default Calendar;
