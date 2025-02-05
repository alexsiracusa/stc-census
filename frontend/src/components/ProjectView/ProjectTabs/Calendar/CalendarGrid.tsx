import React from 'react';
import { Event } from './Calendar';
import './Calendar.css';

type CalendarGridProps = {
    calendarDays: { date: Date; isCurrentMonth: boolean }[];
    events: Event[];
    openEventForm: (date: Date, eventToEdit?: Event) => void;
    openAllEventsOverlay: (date: Date) => void;
    openEditForm: (event: Event) => void;
};

const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

const isDateInRange = (date: Date, startDate: string, endDate: string): boolean => {
    const eventStart = new Date(startDate);
    const eventEnd = new Date(endDate);
    return date >= eventStart && date <= eventEnd;
};

const isSameDate = (date: Date, startDate: string): boolean => {
    const eventStart = new Date(startDate);
    return date.getFullYear() === eventStart.getFullYear() &&
        date.getMonth() === eventStart.getMonth() &&
        date.getDate() === eventStart.getDate();
};

const CalendarGrid: React.FC<CalendarGridProps> = ({
                                                       calendarDays,
                                                       events,
                                                       openEventForm,
                                                       openAllEventsOverlay,
                                                       openEditForm,
                                                   }) => {
    return (
        <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayKey) => (
                <div key={dayKey} className="weekday">
                    {dayKey}
                </div>
            ))}

            {calendarDays.map(({ date, isCurrentMonth }, index) => (
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
                                isSameDate(date, event.startDate)
                            )
                            .slice(0, 4)
                            .map((event) => (
                                <div
                                    key={event.id}
                                    className="event-block"
                                    style={{ backgroundColor: event.color }}
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
                            isSameDate(date, event.startDate)
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
                                        isSameDate(date, event.startDate)
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
