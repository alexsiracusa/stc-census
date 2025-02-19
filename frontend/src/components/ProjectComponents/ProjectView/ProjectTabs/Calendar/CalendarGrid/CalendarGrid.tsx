import React, { useState, useEffect } from "react";
import { Event } from "../Calendar";
import { useTranslation } from "react-i18next";
import "./CalendarGrid.css";
import { isToday, isSameDay } from "date-fns";
import TaskPopup from "../../../../../TaskComponents/TaskPopup/TaskPopup";
import AllEventsPopup from "../AllEventsPopup/AllEventsPopup";

type CalendarGridProps = {
    calendarDays: { date: Date; isCurrentMonth: boolean }[];
    events: Event[];
    currentProjectId: number;
    setEvents: (events: Event[]) => void;
    openEventForm: (date: Date, eventToEdit?: Event) => void;
    openEditForm: (event: Event) => void;
    onDeleteEvent: (eventId: string) => void;
    editing: boolean;
    select: (boolean) => void;
    project_id: number;
    task_id: number;
};

const isStartOrEndDate = (date: Date, startDate: string, endDate: string): boolean => {
    const eventStart = new Date(startDate);
    const eventEnd = new Date(endDate);
    return isSameDay(date, eventStart) || isSameDay(date, eventEnd);
};

const CalendarGrid: React.FC<CalendarGridProps> = ({
                                                       calendarDays,
                                                       events,
                                                       currentProjectId,
                                                       openEventForm,
                                                   }) => {
    const { t } = useTranslation();
    const [maxEventsPerDay, setMaxEventsPerDay] = useState(2);
    const [allEventsDate, setAllEventsDate] = useState<Date | null>(null);
    const [allEventsForDate, setAllEventsForDate] = useState<Event[]>([]);

    useEffect(() => {
        const rows = Math.ceil(calendarDays.length / 7);
        setMaxEventsPerDay(rows === 6 ? 3 : 3);
    }, [calendarDays]);

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
                            className={`day-box ${isCurrentMonth ? "" : "other-month"} ${
                                isToday(date) ? "today" : ""
                            }`}
                            onClick={(e) => {
                                if (!(e.target as HTMLElement).classList.contains("more-events")) {
                                    openEventForm(date);
                                }
                            }}
                        >
                            <div className={`day-num ${isToday(date) ? "today" : ""}`}>
                                {date.getDate()}
                            </div>
                            <div className="event-list">
                                {events
                                    .filter((event) =>
                                        isStartOrEndDate(date, event.startDate, event.endDate)
                                    )
                                    .slice(0, maxEventsPerDay)
                                    .map((event) => (
                                        <TaskPopup
                                            key={event.id}
                                            project_id={currentProjectId}
                                            task_id={Number(event.id)}
                                            buttonClassName="event-block"
                                        >
                                            <div
                                                className="event-block"
                                                style={{ backgroundColor: event.color, padding: "4.8px 8px"}}
                                            >
                                                {localizeTitle(event.title)}
                                            </div>
                                        </TaskPopup>
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
                                        ).length - maxEventsPerDay} ${t(
                                            "calendar.calendarGrid.more"
                                        )}`}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {allEventsDate && allEventsForDate.length > 0 && (
                    <AllEventsPopup
                        date={allEventsDate}
                        tasks={allEventsForDate.map((event) => ({
                            id: event.id,
                            name: localizeTitle(event.title),
                            status: event.status,
                            target_start_date: event.startDate,
                            target_completion_date: event.endDate,
                        }))}
                        onClose={closeAllEvents}
                        openTaskDetails={(taskId: number) => {
                            const taskToOpen = events.find((event) => event.id === taskId.toString());
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default CalendarGrid;
