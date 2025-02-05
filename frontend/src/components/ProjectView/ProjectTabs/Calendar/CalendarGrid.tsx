import React, { useState } from 'react';
import { Event } from './Calendar';
import { useTranslation } from "react-i18next";
import "./CalendarGrid.css";
import { isToday, isSameDay } from "date-fns";
import EventPopup from "./EventPopup";
import AllEventsPopup from "./AllEventsPopup";

type CalendarGridProps = {
    calendarDays: { date: Date; isCurrentMonth: boolean }[];
    events: Event[];
    setEvents: (events: Event[]) => void;
    openEventForm: (date: Date, eventToEdit?: Event) => void;
    openEditForm: (event: Event) => void;
    openAllEventsOverlay: (date: Date) => void;
};

const isDateInRange = (date: Date, startDate: string, endDate: string): boolean => {
    const eventStart = new Date(startDate);
    const eventEnd = new Date(endDate);
    return date >= eventStart && date <= eventEnd;
};

const CalendarGrid: React.FC<CalendarGridProps> = ({
                                                       calendarDays,
                                                       events,
                                                       setEvents,
                                                       openEventForm,
                                                   }) => {
    const { t } = useTranslation();
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [allEventsDate, setAllEventsDate] = useState<Date | null>(null);
    const [allEventsForDate, setAllEventsForDate] = useState<Event[]>([]);

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedEvent(null);
    };

    const openAllEvents = (date: Date) => {
        const filteredEvents = events.filter(
            (event) =>
                isDateInRange(date, event.startDate, event.endDate) ||
                isSameDay(date, new Date(event.startDate))
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
            openEventForm(new Date(selectedEvent.startDate), selectedEvent);
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
                alert("Event link copied to clipboard!");
            });
        }
    };

    const handleEmail = () => {
        if (selectedEvent) {
            const mailto = `mailto:?subject=Invitation to ${selectedEvent.title}&body=Please join the event: ${selectedEvent.title} from ${selectedEvent.startDate} to ${selectedEvent.endDate}`;
            window.open(mailto, "_blank");
        }
    };

    return (
        <>
            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayKey) => (
                    <div key={dayKey} className="weekday">
                        {t(`calendar.days.${dayKey.toLowerCase()}`)} {/* Ensure translation keys exist */}
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
                            {date.getDate()} {/* Display day number */}
                        </div>
                        <div className="event-list">
                            {events
                                .filter((event) =>
                                    isDateInRange(date, event.startDate, event.endDate) || isSameDay(date, new Date(event.startDate))
                                )
                                .slice(0, 4)
                                .map((event) => (
                                    <div
                                        key={event.id}
                                        className="event-block"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEventClick(event);
                                        }}
                                    >
                                        {event.title}
                                    </div>
                                ))}

                            {events.filter((event) =>
                                isDateInRange(date, event.startDate, event.endDate) || isSameDay(date, new Date(event.startDate))
                            ).length > 4 && (
                                <button
                                    className="more-events"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openAllEvents(date);
                                    }}
                                >
                                    {`+ ${
                                        events.filter((event) =>
                                            isDateInRange(date, event.startDate, event.endDate) ||
                                            isSameDay(date, new Date(event.startDate))
                                        ).length - 4
                                    } more`}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Event Popup */}
            {isPopupOpen && selectedEvent && (
                <EventPopup
                    isOpen={isPopupOpen}
                    onClose={closePopup}
                    eventData={{
                        title: selectedEvent.title,
                        startDate: selectedEvent.startDate,
                        endDate: selectedEvent.endDate,
                        description: selectedEvent.description || "(No description)",
                        organizer: selectedEvent.organizer || "Unknown",
                    }}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onShare={handleShare}
                    onEmail={handleEmail}
                />
            )}

            {/* All Events Popup */}
            {allEventsDate && (
                <AllEventsPopup
                    date={allEventsDate}
                    events={allEventsForDate}
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
