import './Calendar.css';
import { useTranslation } from 'react-i18next';
import TabProps from "../TabProps.ts";
import {useState} from "react";

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
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth())
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

    const events: Array<Event> = [
        {
            date: t('calendar.exampleEvent.date', { defaultValue: 'May 15, 2024' }),
            time: t('calendar.exampleEvent.time', { defaultValue: '10:00' }),
            text: t('calendar.exampleEvent.text', { defaultValue: 'Meeting with Gu' }),
        },
    ];

    return (
        <div className="calendar-app">
            <div className="calendar">
                <h1 className="heading">
                    {t('calendar.title')} {props.project['id']}
                </h1>
                <div className="navigate-date">
                    <h2 className="month">{monthsOfYear[4]}</h2> {/* "May" */}
                    <h2 className="year">2024</h2>
                    <div className="buttons">
                        <i className="bx bx-chevron-left"></i>
                        <i className="bx bx-chevron-right"></i>
                    </div>
                </div>
                <div className="weekdays">
                    {daysOfWeek.map((day, index) => (
                        <span key={index}>{day}</span>
                    ))}
                </div>
                <div className="days">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <span key={day} className={day === 22 ? 'current-day' : ''}>
                            {day}
                        </span>
                    ))}
                </div>
            </div>
            <div className="events">
                <div className="event-popup">
                    <div className="time-input">
                        <div className="event-popup-time">{t('calendar.eventPopup.time')}</div>
                        <input
                            type="number"
                            name="hours"
                            min={0}
                            max={24}
                            className="hours"
                            aria-label={t('calendar.eventPopup.hours')}
                        />
                        <input
                            type="number"
                            name="minutes"
                            min={0}
                            max={60}
                            className="minutes"
                            aria-label={t('calendar.eventPopup.minutes')}
                        />
                    </div>
                    <textarea
                        placeholder={t('calendar.eventPopup.placeholder', {
                            defaultValue: 'Enter Event Text (Maximum 60 Characters)',
                        })}
                    />
                    <button className="event-popup-btn">
                        {t('calendar.eventPopup.addButton')}
                    </button>
                    <button
                        className="close-event-popup"
                        aria-label={t('calendar.eventPopup.closeButton')}
                    >
                        <i className="bx bx-x"></i>
                    </button>
                </div>
                {events.map((event, index) => (
                    <div className="event" key={index}>
                        <div className="event-date-wrapper">
                            <div className="event-date">{event.date}</div>
                            <div className="event-time">{event.time}</div>
                        </div>
                        <div className="event-text">{event.text}</div>
                        <div className="event-buttons">
                            <i className="bx bxs-edit-alt" aria-label={t('calendar.eventButtons.edit')} />
                            <i className="bx bxs-message-alt-x" aria-label={t('calendar.eventButtons.delete')} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
