import React from 'react';
import {Event} from './Calendar';
import './Calendar.css';
import {isToday, isSameDay} from "date-fns";
import {useTranslation} from "react-i18next";

type CalendarGridProps = {
    calendarDays: { date: Date; isCurrentMonth: boolean }[];
    events: Event[];
    openEventForm: (date: Date, eventToEdit?: Event) => void;
    openAllEventsOverlay: (date: Date) => void;
    openEditForm: (event: Event) => void;
};


const isDateInRange = (date: Date, startDate: string, endDate: string): boolean => {
    const eventStart = new Date(startDate);
    const eventEnd = new Date(endDate);
    return date >= eventStart && date <= eventEnd;
};

const CalendarGrid: React.FC<CalendarGridProps> = (
    {
        calendarDays,
        events,
        openEventForm,
        openAllEventsOverlay,
        openEditForm,
    }) =>
{
    const {t} = useTranslation();

    return (
        <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayKey) => (
                <div key={dayKey} className="weekday">
                    {t(`calendar.days.${dayKey.toLowerCase()}`)}
                </div>
            ))}

            {calendarDays.map(({date, isCurrentMonth}, index) => (
                <div
                    key={index}
                    className={`day-cell ${isCurrentMonth ? '' : 'other-month'} ${isToday(date) ? 'today' : ''}`}
                    onClick={(e) => {
                        if ((e.target as HTMLElement).classList.contains('more-events')) {
                            return;
                        }
                        openEventForm(date);
                    }}
                >
                    <div className={`day-number ${isToday(date) ? 'today' : ''}`}>{date.getDate()}</div>
                    <div className="event-list">
                        {events
                            .filter(event =>
                                isDateInRange(date, event.startDate, event.endDate) ||
                                isSameDay(date, event.startDate)
                            )
                            .slice(0, 4)
                            .map((event) => (
                                <div
                                    key={event.id}
                                    className="event-block"
                                    style={{backgroundColor: event.color}}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEditForm(event);
                                    }}
                                >
                                    {event.title}
                                </div>
                            ))}

                        {events.filter(event =>
                            isDateInRange(date, event.startDate, event.endDate) ||
                            isSameDay(date, event.startDate)
                        ).length > 4 && (
                            <button
                                className="more-events"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openAllEventsOverlay(date);
                                }}
                            >
                                {`+ ${
                                    events.filter(event =>
                                        isDateInRange(date, event.startDate, event.endDate) ||
                                        isSameDay(date, event.startDate)
                                    ).length - 4
                                } more`}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CalendarGrid;
