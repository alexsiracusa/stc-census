import './Calendar.css';
import { useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { BsPlusCircle } from 'react-icons/bs';

type Event = {
    date: string;
    startTime: string;
    endTime: string;
    text: string;
    calendar: string;
};

const Calendar = () => {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [selectedCalendars, setSelectedCalendars] = useState<string[]>(['My Calendar']);
    const [events, setEvents] = useState<Event[]>([]);
    const [showEventForm, setShowEventForm] = useState(false);
    const [newEvent, setNewEvent] = useState<Event>({
        date: '',
        startTime: '',
        endTime: '',
        text: '',
        calendar: 'My Calendar',
    });

    const getStartOfWeek = (date: Date) => {
        const copy = new Date(date);
        const day = copy.getDay();
        const diff = copy.getDate() - day;
        return new Date(copy.setDate(diff));
    };

    const startOfWeek = getStartOfWeek(currentWeek);
    const daysInWeek = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        return day;
    });

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const handleNavigateWeek = (direction: number) => {
        const newDate = new Date(currentWeek);
        newDate.setDate(currentWeek.getDate() + direction * 7);
        setCurrentWeek(newDate);
    };

    const handleNavigateToDate = (date: Date) => {
        setCurrentWeek(new Date(date));
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return formatDate(date) === formatDate(today);
    };

    const isCurrentHour = (hour: number) => {
        const now = new Date();
        return now.getHours() === hour && isToday(now);
    };

    const handleSelectCalendar = (calendar: string) => {
        if (selectedCalendars.includes(calendar)) {
            setSelectedCalendars(selectedCalendars.filter((c) => c !== calendar));
        } else {
            setSelectedCalendars([...selectedCalendars, calendar]);
        }
    };

    const handleAddEvent = () => {
        if (newEvent.text && newEvent.date && newEvent.startTime && newEvent.endTime) {
            setEvents([...events, newEvent]);
            setNewEvent({ date: '', startTime: '', endTime: '', text: '', calendar: 'My Calendar' });
            setShowEventForm(false);
        }
    };

    return (
        <div className="calendar-app">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Calendar</h2>
                    <button
                        className="create-event-button"
                        onClick={() => setShowEventForm(true)}
                        aria-label="Create new event"
                    >
                        <BsPlusCircle size={20} /> Create
                    </button>
                </div>
                <div className="calendar-mini">
                    <div className="mini-current-month">
                        {startOfWeek.toLocaleString('default', { month: 'long' })} {startOfWeek.getFullYear()}
                    </div>
                    <div className="mini-grid">
                        {Array.from({ length: 31 }, (_, i) => {
                            const day = i + 1;
                            return (
                                <div
                                    key={day}
                                    className={`mini-date ${
                                        isToday(new Date(currentWeek.getFullYear(), currentWeek.getMonth(), day)) ? 'today' : ''
                                    }`}
                                    onClick={() => handleNavigateToDate(new Date(currentWeek.getFullYear(), currentWeek.getMonth(), day))}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Go to date ${new Date(currentWeek.getFullYear(), currentWeek.getMonth(), day).toLocaleDateString()}`}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="calendar-list">
                    <h3>My Calendars</h3>
                    <div className="calendar-item">
                        <input
                            type="checkbox"
                            checked={selectedCalendars.includes('My Calendar')}
                            onChange={() => handleSelectCalendar('My Calendar')}
                        />
                        My Calendar
                    </div>
                    <h3>Other Calendars</h3>
                    <div className="calendar-item">
                        <input
                            type="checkbox"
                            checked={selectedCalendars.includes('Holidays')}
                            onChange={() => handleSelectCalendar('Holidays')}
                        />
                        Holidays
                    </div>
                </div>
            </aside>

            <main className="calendar-container">
                <div className="calendar-header">
                    <button onClick={() => setCurrentWeek(new Date())} className="today-button" aria-label="Go to today">
                        Today
                    </button>
                    <div className="navigate-controls">
                        <BiChevronLeft size={24} onClick={() => handleNavigateWeek(-1)} aria-label="Previous week" />
                        <BiChevronRight size={24} onClick={() => handleNavigateWeek(1)} aria-label="Next week" />
                    </div>
                    <div className="current-week-display">
                        {`${startOfWeek.toLocaleString('default', { month: 'long' })} ${startOfWeek.getFullYear()}`}
                    </div>
                </div>
                <div className="calendar-grid">
                    <div className="time-label-column">
                        {Array.from({ length: 24 }, (_, i) => (
                            <div key={i} className="time-label">
                                {i > 12 ? `${i - 12} PM` : `${i || 12} AM`}
                            </div>
                        ))}
                    </div>

                    <div className="week-column-header">
                        {daysInWeek.map((day, index) => (
                            <div key={index} className={`day-header ${isToday(day) ? 'today' : ''}`}>
                                <div className="day-name">{day.toLocaleString('default', { weekday: 'short' }).toUpperCase()}</div>
                                <div className="day-number">{day.getDate()}</div>
                            </div>
                        ))}
                    </div>

                    <div className="week-columns">
                        {daysInWeek.map((day, dayIndex) => (
                            <div key={dayIndex} className={`day-column ${isToday(day) ? 'highlight-today' : ''}`}>
                                {Array.from({ length: 24 }, (_, hour) => (
                                    <div
                                        key={hour}
                                        className={`time-slot ${isCurrentHour(hour) ? 'current-hour' : ''}`}
                                        title={`No events for ${hour}:00`}
                                    >
                                        {events
                                            .filter(
                                                (event) =>
                                                    event.date === formatDate(day) &&
                                                    parseInt(event.startTime.split(':')[0]) === hour
                                            )
                                            .map((event, index) => (
                                                <div
                                                    key={index}
                                                    className={`event ${
                                                        selectedCalendars.includes(event.calendar) ? '' : 'hidden'
                                                    }`}
                                                >
                                                    {event.text}
                                                </div>
                                            ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {showEventForm && (
                <div className="overlay">
                    <div className="event-form">
                        <h3>Create Event</h3>
                        <input
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        />
                        <input
                            type="time"
                            value={newEvent.startTime}
                            onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                        />
                        <input
                            type="time"
                            value={newEvent.endTime}
                            onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Event Title"
                            value={newEvent.text}
                            onChange={(e) => setNewEvent({ ...newEvent, text: e.target.value })}
                        />
                        <select
                            value={newEvent.calendar}
                            onChange={(e) => setNewEvent({ ...newEvent, calendar: e.target.value })}
                        >
                            <option value="My Calendar">My Calendar</option>
                            <option value="Holidays">Holidays</option>
                        </select>
                        <button onClick={handleAddEvent}>Add Event</button>
                        <button onClick={() => setShowEventForm(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
