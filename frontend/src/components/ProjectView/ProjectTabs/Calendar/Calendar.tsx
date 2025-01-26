import { useState } from 'react';
import './Calendar.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

type Event = {
    id: string;
    title: string;
    date: string;
    time?: string;
    color: string;
};

const Calendar = () => {
    const { t } = useTranslation();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventColor, setNewEventColor] = useState('#4CAF50');
    const [newEventTime, setNewEventTime] = useState('');
    const [popupDate, setPopupDate] = useState<Date | null>(null);

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
                            if (
                                e.target instanceof HTMLElement &&
                                e.target.classList.contains('more-events')
                            ) {
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
                                .slice(0, 3)
                                .map((event) => (
                                    <div
                                        key={event.id}
                                        className="event-block"
                                        style={{ backgroundColor: event.color }}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            {events.filter((event) => event.date === formatDate(date)).length > 3 && (
                                <button
                                    className="more-events"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPopupDate(date);
                                    }}
                                >
                                    {`+${events.filter((event) => event.date === formatDate(date)).length - 3} more`}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {popupDate && (
                <div className="event-popup-overlay" onClick={() => setPopupDate(null)}>
                    <div className="event-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="event-popup-header">
                            <h3>
                                {popupDate.toLocaleString('default', { weekday: 'long' })}{' '}
                                {popupDate.getDate()}
                            </h3>
                            <button className="close-popup" onClick={() => setPopupDate(null)}>
                                &times;
                            </button>
                        </div>
                        <div className="event-popup-body">
                            {events
                                .filter((event) => event.date === formatDate(popupDate))
                                .map((event) => (
                                    <div
                                        className="popup-event-block"
                                        key={event.id}
                                        style={{ backgroundColor: event.color }}
                                    >
                                        {event.time ? `${event.time} - ` : ''} {event.title}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}
            {isEventFormOpen && (
                <div className="event-form-overlay">
                    <div className="event-form">
                        <h3>{t('calendar.eventPopup.addButton')}</h3>
                        <label>
                            {t('calendar.eventPopup.placeholder')}:
                            <input
                                type="text"
                                value={newEventTitle}
                                placeholder={t('calendar.eventPopup.placeholder')}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                            />
                        </label>
                        <label>
                            {t('calendar.eventPopup.time')}:
                            <input
                                type="time"
                                value={newEventTime}
                                onChange={(e) => setNewEventTime(e.target.value)}
                            />
                        </label>
                        <label>
                            {t('calendar.eventPopup.color')}:
                            <input
                                type="color"
                                value={newEventColor}
                                onChange={(e) => setNewEventColor(e.target.value)}
                            />
                        </label>
                        <div className="form-actions">
                            <button onClick={closeEventForm}>{t('calendar.eventPopup.removeButton')}</button>
                            <button onClick={saveEvent}>{t('calendar.eventPopup.updateButton')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
