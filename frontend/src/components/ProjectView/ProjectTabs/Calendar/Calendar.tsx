import './Calendar.css';
import { useTranslation } from 'react-i18next';
import TabProps from "../TabProps.ts";
import { useState } from "react";
import { HiPencilAlt } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { BsBoxArrowInRight } from "react-icons/bs";

type Event = {
    date: string;
    time: string;
    text: string;
};

const Calendar = (props: TabProps) => {
    const { t } = useTranslation();

    const daysOfWeek: Array<string> = [
        t('calendar.days.sun'),
        t('calendar.days.mon'),
        t('calendar.days.tue'),
        t('calendar.days.wed'),
        t('calendar.days.thu'),
        t('calendar.days.fri'),
        t('calendar.days.sat'),
    ];

    const monthsOfYear: Array<string> = [
        t('calendar.months.january'),
        t('calendar.months.february'),
        t('calendar.months.march'),
        t('calendar.months.april'),
        t('calendar.months.may'),
        t('calendar.months.june'),
        t('calendar.months.july'),
        t('calendar.months.august'),
        t('calendar.months.september'),
        t('calendar.months.october'),
        t('calendar.months.november'),
        t('calendar.months.december'),
    ];

    const currentDate = new Date();
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
    const [events, setEvents] = useState<Array<Event>>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupInput, setPopupInput] = useState({ time: '', text: '', editIndex: -1 });

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const navigateMonth = (direction: number) => {
        let newMonth = currentMonth + direction;
        let newYear = currentYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const handleDayClick = (day: number) => {
        const clickedDate = new Date(currentYear, currentMonth, day);
        setSelectedDate(clickedDate);
        const eventToEdit = events.find(event => event.date === `${clickedDate.getFullYear()}-${clickedDate.getMonth() + 1}-${clickedDate.getDate()}`);
        if (eventToEdit) {
            setPopupInput({ time: eventToEdit.time, text: eventToEdit.text, editIndex: events.indexOf(eventToEdit) });
        } else {
            setPopupInput({ time: '', text: '', editIndex: -1 });
        }
        setShowPopup(true);
    };

    const handleAddEvent = () => {
        if (popupInput.text.trim() && popupInput.time.trim()) {
            const eventDate = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
            if (popupInput.editIndex >= 0) {
                const updatedEvents = events.map((event, index) =>
                    index === popupInput.editIndex
                        ? { ...event, time: popupInput.time, text: popupInput.text }
                        : event
                );
                setEvents(updatedEvents);
            } else {
                setEvents(prevEvents => [
                    ...prevEvents,
                    { date: eventDate, time: popupInput.time, text: popupInput.text },
                ]);
            }
            setShowPopup(false);
            setPopupInput({ time: '', text: '', editIndex: -1 });
        }
    };

    const handleEventDelete = (index: number) => {
        setEvents(prevEvents => prevEvents.filter((_, i) => i !== index));
    };

    const isEventOnDay = (day: number) => {
        const dateToCheck = `${currentYear}-${currentMonth + 1}-${day}`;
        return events.some(event => event.date === dateToCheck);
    };

    return (
        <div className="calendar-app">
            <div className="calendar">
                <h1 className="heading">
                    {t('calendar.title')} {props.project['id']}
                </h1>

                <div className="navigate-date">
                    <h2 className="month">{monthsOfYear[currentMonth]}</h2>
                    <h2 className="year">{currentYear}</h2>
                    <div className="buttons">
                        <BiChevronLeft size={24} onClick={() => navigateMonth(-1)} />
                        <BiChevronRight size={24} onClick={() => navigateMonth(1)} />
                    </div>
                </div>

                <div className="weekdays">
                    {daysOfWeek.map((day, index) => (
                        <span key={index}>{day}</span>
                    ))}
                </div>

                <div className="days">
                    {Array(firstDayOfMonth).fill(null).map((_, i) => (
                        <span key={`empty-${i}`} className="empty-day"></span>
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => (
                        <span
                            key={day}
                            className={`
                                ${selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth ? 'current-day' : ''}
                                ${isEventOnDay(day) ? 'has-event' : ''}
                            `}
                            onClick={() => handleDayClick(day)}
                        >
                            {day}
                        </span>
                    ))}
                </div>
            </div>

            <div className="events">
                <button className="add-event-button" onClick={() => {
                    setSelectedDate(currentDate);
                    setPopupInput({ time: '', text: '', editIndex: -1 });
                    setShowPopup(true);
                }}>
                    {t('calendar.addEventButton')}
                </button>

                {events
                    .filter(event => event.date === `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`)
                    .map((event, index) => (
                        <div className="event" key={index}>
                            <div className="event-date-wrapper">
                                <div className="event-date">{event.date}</div>
                                <div className="event-time">{event.time}</div>
                            </div>
                            <div className="event-text">{event.text}</div>
                            <div className="event-buttons">
                                <HiPencilAlt className="edit-icon" onClick={() => {
                                    setPopupInput({ time: event.time, text: event.text, editIndex: index });
                                    setShowPopup(true);
                                }} />
                                <AiOutlineClose className='delete-icon' onClick={() => handleEventDelete(index)} />
                            </div>
                        </div>
                    ))}

                {showPopup && (
                    <div className="event-popup">
                        <div className="time-input">
                            <div className="event-popup-time">{t('calendar.eventPopup.time')}</div>
                            <input
                                type="text"
                                name="time"
                                value={popupInput.time}
                                onChange={e => setPopupInput({ ...popupInput, time: e.target.value })}
                                placeholder={t('calendar.eventPopup.enterTime')}
                                className="time"
                            />
                        </div>
                        <textarea
                            placeholder={t('calendar.eventPopup.placeholder')}
                            maxLength={60}
                            value={popupInput.text}
                            onChange={e => setPopupInput({ ...popupInput, text: e.target.value })}
                        />
                        <button className="event-popup-btn" onClick={handleAddEvent}>
                            {popupInput.editIndex >= 0 ? t('calendar.eventPopup.updateButton') : t('calendar.eventPopup.addButton')}
                        </button>
                        <button
                            className="close-event-popup"
                            onClick={() => setShowPopup(false)}
                            aria-label={t('calendar.eventPopup.closeButton')}
                        >
                            <BsBoxArrowInRight size={24} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calendar;
