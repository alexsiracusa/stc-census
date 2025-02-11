import React, { useState, useEffect } from "react";
import { Event } from "../Calendar.tsx";
import { useTranslation } from "react-i18next";
import "./CalendarGrid.css";
import { isToday, isSameDay } from "date-fns";
import EventPopup from "../EventPopup/EventPopup.tsx";
import AllEventsPopup from "../AllEventsPopup/AllEventsPopup.tsx";

type CalendarGridProps = {
    calendarDays: { date: Date; isCurrentMonth: boolean }[];
    events: Event[];
    setEvents: (events: Event[]) => void;
    openEventForm: (date: Date, eventToEdit?: Event) => void;
    openEditForm: (event: Event) => void;
};

const isStartOrEndDate = (date: Date, startDate: string, endDate: string): boolean => {
    const eventStart = new Date(startDate);
    const eventEnd = new Date(endDate);
    return isSameDay(date, eventStart) || isSameDay(date, eventEnd);
};

const CalendarGrid: React.FC<CalendarGridProps> = ({
                                                       calendarDays,
                                                       events,
                                                       setEvents,
                                                       openEventForm,
                                                       openEditForm,
                                                   }) => {
    const { t } = useTranslation();
    const [maxEventsPerDay, setMaxEventsPerDay] = useState(2);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [allEventsDate, setAllEventsDate] = useState<Date | null>(null);
    const [allEventsForDate, setAllEventsForDate] = useState<Event[]>([]);

    useEffect(() => {
        const rows = Math.ceil(calendarDays.length / 7);
        setMaxEventsPerDay(rows === 6 ? 1 : 1);
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

    const handleEdit = () => {
        if (selectedEvent) {
            openEditForm(selectedEvent);
            closePopup();
        }
    };

    const handleDelete = () => {
        if (selectedEvent) {
            const updatedEvents = events.filter((event) => event.id !== selectedEvent.id);
            setEvents(updatedEvents);
            closePopup();
        }
    };

    const handleShare = () => {
        if (selectedEvent) {
            const shareLink = `http://localhost:5173/project/1/calendar/${selectedEvent.id}`;
            navigator.clipboard.writeText(shareLink).then(() => {
                alert(t('calendar.calendarGrid.linkCopied'));
            });
        }
    };

    const handleEmail = () => {
        if (selectedEvent) {
            const mailto = `mailto:?subject=${t('calendar.calendarGrid.invitationSubject', { title: selectedEvent.title })}&body=${t('calendar.calendarGrid.invitationBody', { title: selectedEvent.title, start: selectedEvent.startDate, end: selectedEvent.endDate })}`;
            window.open(mailto, "_blank");
        }
    };

    const localizeTitle = (title: string): string => {
        const localizedDefaultTitle = t("calendar.eventForm.defaultTitle");
        const knownDefaults = ["(No title)", "(无标题)"];
        return knownDefaults.includes(title) ? localizedDefaultTitle : title;
    };

    return (
        <>
            <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayKey) => (
                    <div key={dayKey} className="weekday">
                        {t(`calendar.days.${dayKey.toLowerCase()}`)}
                    </div>
                ))}
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
                                    ).length - maxEventsPerDay} ${t('calendar.calendarGrid.more')}`}
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
                        note: selectedEvent.note || t('calendar.calendarGrid.noNote'),
                    }}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onShare={handleShare}
                    onEmail={handleEmail}
                />
            )}
            {allEventsDate && (
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
        </>
    );
};

export default CalendarGrid;
