import { useState } from 'react';
import './Calendar.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faClock, faAlignLeft } from '@fortawesome/free-solid-svg-icons';

type Event = {
    id: string;
    title: string;
    date: string;
    startTime?: string;
    endTime?: string;
    color: string;
    repeat?: string;
};

const Calendar = () => {
    const { t } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const [isAllEventsOverlayOpen, setIsAllEventsOverlayOpen] = useState(false);
    const [allEventsForDate, setAllEventsForDate] = useState<Event[]>([]);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventStartDate, setNewEventStartDate] = useState(new Date().toLocaleDateString('en-CA'));
    const [newEventEndDate, setNewEventEndDate] = useState(new Date().toLocaleDateString('en-CA'));
    const [newStartTime, setNewStartTime] = useState('');
    const [newEndTime, setNewEndTime] = useState('');
    const [showTimeFields, setShowTimeFields] = useState(false);
    const [newEventColor, setNewEventColor] = useState('#4CAF50');
    const [description, setDescription] = useState('');
    const [repeatOption] = useState('Does not repeat');

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

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-CA');
    };

    const openEventForm = (date: Date) => {
        setSelectedDate(date);
        const formattedDate = formatDate(date);
        setNewEventStartDate(formattedDate);
        setNewEventEndDate(formattedDate);
        setIsEventFormOpen(true);
    };

    const closeEventForm = () => {
        setIsEventFormOpen(false);
        setSelectedDate(null);
        setNewEventTitle('');
        setNewStartTime('');
        setNewEndTime('');
        const today = new Date().toLocaleDateString('en-CA');
        setNewEventStartDate(today);
        setNewEventEndDate(today);
        setShowTimeFields(false);
        setNewEventColor('#4CAF50');
        setDescription('');
    };

    const openAllEventsOverlay = (date: Date) => {
        const formattedDate = formatDate(date);
        const eventsForDate = events.filter((event) => event.date === formattedDate);
        setAllEventsForDate(eventsForDate);
        setSelectedDate(date);
        setIsAllEventsOverlayOpen(true);
    };

    const closeAllEventsOverlay = () => {
        setIsAllEventsOverlayOpen(false);
        setSelectedDate(null);
        setAllEventsForDate([]);
    };

    const saveEvent = () => {
        if (selectedDate && newEventTitle) {
            const newEvent: Event = {
                id: Math.random().toString(36).substr(2, 9),
                title: newEventTitle,
                date: newEventStartDate,
                startTime: newStartTime,
                endTime: newEndTime,
                color: newEventColor,
                repeat: repeatOption,
            };
            setEvents([...events, newEvent]);
        }
        closeEventForm();
    };

    const resetToToday = () => {
        setCurrentMonth(new Date());
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    return (
        <div className="calendar-container">
            <header className="calendar-header">
                <button className="today-button" onClick={resetToToday}>
                    {t('calendar.today')}
                </button>
                <div className="nav-buttons">
                    <button className="nav-button" onClick={() => handleNavigate(-1)}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button className="nav-button" onClick={() => handleNavigate(1)}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
                <h2>
                    {t(`calendar.months.${currentMonth.toLocaleString('default', { month: 'long' }).toLowerCase()}`)}{' '}
                    {currentMonth.getFullYear()}
                </h2>
            </header>
            <div className="calendar-grid">
                {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((dayKey) => (
                    <div key={dayKey} className="weekday">
                        {t(`calendar.days.${dayKey}`)}
                    </div>
                ))}
                {calendarDays.map(({ date, isCurrentMonth }, index) => (
                    <div
                        key={index}
                        className={`day-cell ${isCurrentMonth ? '' : 'other-month'} ${isToday(date) ? 'today' : ''}`}
                        onClick={(e) => {
                            if (e.target instanceof HTMLElement && e.target.classList.contains('more-events')) {
                                return;
                            }
                            openEventForm(date);
                        }}
                    >
                        <div className={`day-number ${isToday(date) ? 'today' : ''}`}>
                            {date.getDate()}
                        </div>
                        <div className="event-list">
                            {events
                                .filter((event) => event.date === formatDate(date))
                                .slice(0, 4)
                                .map((event) => (
                                    <div
                                        key={event.id}
                                        className="event-block"
                                        style={{ backgroundColor: event.color }}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            {events.filter((event) => event.date === formatDate(date)).length > 4 && (
                                <button
                                    className="more-events"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openAllEventsOverlay(date);
                                    }}
                                >
                                    {`${events.filter((event) => event.date === formatDate(date)).length - 4} more`}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {isEventFormOpen && (
                <div className="event-form-overlay">
                    <div className="event-form">
                        <div className="event-form-header">
                            <button className="close-form" onClick={closeEventForm}>&times;</button>
                        </div>
                        <div className="event-form-body" style={{ minWidth: '400px' }}>
                            <input
                                className="event-title-input"
                                type="text"
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                                placeholder="Add title"
                            />
                            <div className="event-form-tabs">
                                <button className="tab-active">Event</button>
                                <button className="tab">Task</button>
                            </div>
                            <div className="event-date-range">
                                <FontAwesomeIcon icon={faClock} className="time-icon" />
                                <div className="date-inputs">
                                    <input
                                        type="date"
                                        value={newEventStartDate}
                                        onChange={(e) => setNewEventStartDate(e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        value={newEventEndDate}
                                        onChange={(e) => setNewEventEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="event-time-display">
                                {showTimeFields && (
                                    <div className="event-time-container">
                                        <input
                                            type="time"
                                            className="event-time-input"
                                            value={newStartTime}
                                            onChange={(e) => setNewStartTime(e.target.value)}
                                        />
                                        <span className="time-separator"> - </span>
                                        <input
                                            type="time"
                                            className="event-time-input"
                                            value={newEndTime}
                                            onChange={(e) => setNewEndTime(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="event-form-field">
                                <FontAwesomeIcon icon={faAlignLeft} />
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add description"
                                />
                            </div>
                            <div className="form-footer">
                                <div className="form-actions">
                                    <button className="save-button" onClick={saveEvent}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isAllEventsOverlayOpen && selectedDate && (
                <div className="all-events-overlay">
                    <div className="all-events-content">
                        <div className="all-events-header">
                            <h3>{selectedDate.toDateString()}</h3>
                            <button className="close-button" onClick={closeAllEventsOverlay}>
                                &times;
                            </button>
                        </div>
                        <div className="all-events-body">
                            {allEventsForDate.map((event) => (
                                <div
                                    key={event.id}
                                    className="event-item"
                                    style={{ backgroundColor: event.color }}
                                >
                                    <p>{event.title}</p>
                                    {event.startTime && <p>{`${event.startTime} - ${event.endTime}`}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
