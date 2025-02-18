import React, { useState, useEffect } from "react";
import { Event } from "../Calendar"; // Adjust path accordingly
import { useTranslation } from "react-i18next";
import "./CalendarGrid.css";
import { isToday, isSameDay } from "date-fns";
import EventPopup from "../EventPopup/EventPopup";
import AllEventsPopup from "../AllEventsPopup/AllEventsPopup";

type CalendarGridProps = {
    calendarDays: { date: Date; isCurrentMonth: boolean }[];
    events: Event[];
    currentProjectId: number;
    setEvents: (events: Event[]) => void;
    openEventForm: (date: Date, eventToEdit?: Event) => void;
    openEditForm: (event: Event) => void;
    onDeleteEvent: (eventId: string) => void;
};

const isStartOrEndDate = (date: Date, startDate: string, endDate: string): boolean => {
    const eventStart = new Date(startDate);
    const eventEnd = new Date(endDate);
    return isSameDay(date, eventStart) || isSameDay(date, eventEnd);
};

const CalendarGrid: React.FC<CalendarGridProps> = ({
                                                       calendarDays,
                                                       events,
                                                       openEventForm,
                                                   }) => {
    const { t } = useTranslation();
    const [maxEventsPerDay, setMaxEventsPerDay] = useState(2);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [allEventsDate, setAllEventsDate] = useState<Date | null>(null);
    const [allEventsForDate, setAllEventsForDate] = useState<Event[]>([]);

    useEffect(() => {
        const rows = Math.ceil(calendarDays.length / 7);
        setMaxEventsPerDay(rows === 6 ? 3 : 3); // Set max events based on rows
    }, [calendarDays]);

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedEvent(null);
    };

    const openAllEvents = (date: Date) => {
        const filteredEvents = events.filter((event) =>
            isStartOrEndDate(date, event.startDate, event.endDate)
        );
        setAllEventsDate(date);
        setAllEventsForDate(filteredEvents);
    };

    const closeAllEvents = () => {
        setAllEventsDate(null);
        setAllEventsForDate([]);
    };

    const localizeTitle = (title: string): string => {
        const localizedDefaultTitle = t("calendar.eventForm.defaultTitle");
        const knownDefaults = ["(No title)", "(无标题)"];
        return knownDefaults.includes(title) ? localizedDefaultTitle : title;
    };

    return (
        <>
            <div className="calendar-weekdays">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayKey) => (
                    <div key={dayKey} className="weekday">
                        {t(`calendar.days.${dayKey.toLowerCase()}`)}
                    </div>
                ))}
            </div>
            <div className="calendar-container">
                <div className="calendar-grid">
                    {calendarDays.map(({ date, isCurrentMonth }, index) => (
                        <div
                            key={index}
                            className={`day-cell ${isCurrentMonth ? "" : "other-month"} ${isToday(date) ? "today" : ""}`}
                            onClick={(e) => {
                                if (!(e.target as HTMLElement).classList.contains("more-events")) {
                                    openEventForm(date);
                                }
                            }}
                        >
                            <div className={`day-number ${isToday(date) ? "today" : ""}`}>
                                {date.getDate()}
                            </div>
                            <div className="event-list">
                                {events
                                    .filter((event) => isStartOrEndDate(date, event.startDate, event.endDate))
                                    .slice(0, maxEventsPerDay)
                                    .map((event) => (
                                        <div
                                            key={event.id}
                                            className="event-block"
                                            style={{ backgroundColor: event.color }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEventClick(event);
                                            }}
                                        >
                                            {localizeTitle(event.title)}
                                        </div>
                                    ))}
                                {events.filter((event) =>
                                    isStartOrEndDate(date, event.startDate, event.endDate)
                                ).length > maxEventsPerDay && (
                                    <button
                                        className="more-events"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openAllEvents(date);
                                        }}
                                    >
                                        {`+ ${events.filter((event) =>
                                            isStartOrEndDate(date, event.startDate, event.endDate)
                                        ).length - maxEventsPerDay} ${t("calendar.calendarGrid.more")}`}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {isPopupOpen && selectedEvent && (
                    <EventPopup
                        isOpen={isPopupOpen}
                        onClose={closePopup}
                        eventData={{
                            title: localizeTitle(selectedEvent.title),
                            startDate: selectedEvent.startDate,
                            endDate: selectedEvent.endDate,
                            note: selectedEvent.note || t("calendar.calendarGrid.noNote"),
                        }}
                        project_id={Number(selectedEvent.id)}
                        event_id={String(selectedEvent.id)}
                    />
                )}
                {allEventsDate && allEventsForDate.length > 0 && (
                    <AllEventsPopup
                        date={allEventsDate}
                        events={allEventsForDate.map((event) => ({
                            ...event,
                            title: localizeTitle(event.title),
                        }))}
                        onClose={closeAllEvents}
                        openEventDetails={(eventId: string) => {
                            const eventToOpen = events.find((event) => event.id === eventId);
                            if (eventToOpen) handleEventClick(eventToOpen);
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default CalendarGrid;
