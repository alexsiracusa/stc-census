import { useState } from 'react';
import './Calendar.css';

type Event = {
    id: string;
    title: string;
    date: string;
    time?: string;
    color: string;
};

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventColor, setNewEventColor] = useState('#4CAF50');
    const [newEventTime, setNewEventTime] = useState('');

    const getStartOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
    const getEndOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const handleNavigate = (direction: number) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentMonth(newDate);
    };

    const generateCalendarDays = (): { date: Date; isCurrentMonth: boolean }[] => {
        const startOfMonth = getStartOfMonth(currentMonth);
        const endOfMonth = getEndOfMonth(currentMonth);

        const days: { date: Date; isCurrentMonth: boolean }[] = [];
        const firstDayOfWeek = startOfMonth.getDay();

        for (let i = 0; i < firstDayOfWeek; i++) {
            const previousDay = new Date(startOfMonth);
            previousDay.setDate(previousDay.getDate() - firstDayOfWeek + i);
            days.push({ date: previousDay, isCurrentMonth: false });
        }

        for (let i = 1; i <= endOfMonth.getDate(); i++) {
            days.push({
                date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
                isCurrentMonth: true,
            });
        }

        const remainingDays = 7 - (days.length % 7);
        if (remainingDays < 7) {
            const lastDay = new Date(endOfMonth);
            for (let i = 1; i <= remainingDays; i++) {
                const nextDay = new Date(lastDay);
                nextDay.setDate(lastDay.getDate() + i);
                days.push({ date: nextDay, isCurrentMonth: false });
            }
        }

        return days;
    };

    const calendarDays = generateCalendarDays();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const openEventForm = (date: Date) => {
        setSelectedDate(date);
        setIsEventFormOpen(true);
    };

    const closeEventForm = () => {
        setIsEventFormOpen(false);
        setSelectedDate(null);
        setNewEventTitle('');
        setNewEventTime('');
        setNewEventColor('#4CAF50');
    };

    const saveEvent = () => {
        if (selectedDate && newEventTitle) {
            const newEvent: Event = {
                id: Math.random().toString(36).substr(2, 9),
                title: newEventTitle,
                date: formatDate(selectedDate),
                time: newEventTime,
                color: newEventColor,
            };
            setEvents([...events, newEvent]);
        }
        closeEventForm();
    };

    return (
        <div className="calendar-container">
            <header className="calendar-header">
                <button className="nav-button" onClick={() => handleNavigate(-1)}>
                    <span className="arrow">←</span> Previous
                </button>
                <h2>
                    {currentMonth.toLocaleString('default', { month: 'long' })}{' '}
                    {currentMonth.getFullYear()}
                </h2>
                <button className="nav-button" onClick={() => handleNavigate(1)}>
                    Next <span className="arrow">→</span>
                </button>
            </header>

            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="weekday">
                        {day}
                    </div>
                ))}
                {calendarDays.map(({ date, isCurrentMonth }, index) => (
                    <div
                        key={index}
                        className={`day-cell ${isCurrentMonth ? '' : 'other-month'}`}
                        onClick={() => openEventForm(date)}
                    >
                        <div className="day-number">{date.getDate()}</div>
                        <div className="event-list">
                            {events
                                .filter((event) => event.date === formatDate(date))
                                .map((event) => (
                                    <div
                                        key={event.id}
                                        className="event-block"
                                        style={{ backgroundColor: event.color }}
                                    >
                                        {event.time ? `${event.time} - ` : ''} {event.title}
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {isEventFormOpen && (
                <div className="event-form-overlay">
                    <div className="event-form">
                        <h3>Add Event</h3>
                        <label>
                            Title:
                            <input
                                type="text"
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                            />
                        </label>
                        <label>
                            Time:
                            <input
                                type="time"
                                value={newEventTime}
                                onChange={(e) => setNewEventTime(e.target.value)}
                            />
                        </label>
                        <label>
                            Color:
                            <input
                                type="color"
                                value={newEventColor}
                                onChange={(e) => setNewEventColor(e.target.value)}
                            />
                        </label>
                        <div className="form-actions">
                            <button onClick={closeEventForm}>Cancel</button>
                            <button onClick={saveEvent}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
