import React, { useState, useEffect } from "react";
import { Event } from "../Calendar";
import { useTranslation } from "react-i18next";
import "./CalendarGrid.css";
import { isToday, isSameDay } from "date-fns";
import TaskPopup from "../../../../../TaskComponents/TaskPopup/TaskPopup";
import AllEventsPopup from "../AllEventsPopup/AllEventsPopup";
import { Task } from "../../../../../../types/Task";
import useCreateTask from "../../../../../../hooks/useCreateTask.ts";
import TaskForm from "../../Calendar/TaskForm/TaskForm";

type CalendarGridProps = {
    calendarDays: { date: Date; isCurrentMonth: boolean }[],
    events: Event[],
    currentProjectId: number,
    editing: boolean,
};

const isStartOrEndDate = (date: Date, startDate: string, endDate: string): boolean => {
    const eventStart = new Date(startDate);
    const eventEnd = new Date(endDate);
    return isSameDay(date, eventStart) || isSameDay(date, eventEnd);
};

const CalendarGrid: React.FC<CalendarGridProps> = ({
                                                       calendarDays,
                                                       events = [],
                                                       currentProjectId,
                                                   }) => {
    const { t } = useTranslation();
    const [maxEventsPerDay, setMaxEventsPerDay] = useState(2);
    const [allEventsDate, setAllEventsDate] = useState<Date | null>(null);
    const [allEventsForDate, setAllEventsForDate] = useState<Task[]>([]);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const { createTask } = useCreateTask();
    const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());

    useEffect(() => {
        const rows = Math.ceil(calendarDays.length / 7);
        setMaxEventsPerDay(rows >= 6 ? 3 : 3);
    }, [calendarDays]);

    const openAllEvents = (date: Date) => {
        const filteredEvents = events.filter(event =>
            isStartOrEndDate(date, event.startDate, event.endDate)
        );

        if (filteredEvents.length === 0) return;

        const tasksForPopup: Task[] = filteredEvents.map(event => ({
            id: Number(event.id),
            project_id: event.project_id,
            name: event.title,
            description: "",
            status: event.status,
            target_start_date: event.startDate,
            target_completion_date: event.endDate,
            created_at: "",
            actual_start_date: "",
            actual_completion_date: "",
            target_days_to_complete: 0,
            actual_cost: 0,
            expected_cost: 0,
            depends_on: [],
        }));

        setAllEventsDate(date);
        setAllEventsForDate(tasksForPopup);
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

    const handleCellClick = (date: Date) => {
        setSelectedDate(date);
        setShowTaskForm(true);
        setSelectedTasks(new Set());
    };

    const handleTaskSave = async (taskDetails: { name: string }) => {
        if (selectedDate) {
             createTask(currentProjectId, {
                name: taskDetails.name,
                target_start_date: selectedDate.toISOString(),
                target_completion_date: selectedDate.toISOString(),
            });
            setShowTaskForm(false);
            setSelectedDate(null);
        }
    };

    const toggleTaskSelection = (taskId: number) => {
        if (selectedTasks.has(taskId)) {
            selectedTasks.delete(taskId);
        } else {
            selectedTasks.add(taskId);
        }
        setSelectedTasks(new Set(selectedTasks));
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
                            className={`day-box ${isCurrentMonth ? "" : "other-mon"} ${isToday(date) ? "today" : ""}`}
                            onClick={() => handleCellClick(date)}
                        >
                            <div className={`day-num ${isToday(date) ? "today" : ""}`}>
                                {date.getDate()}
                            </div>
                            <div className="event-list">
                                {events
                                    .filter(event => isStartOrEndDate(date, event.startDate, event.endDate))
                                    .slice(0, maxEventsPerDay)
                                    .map(event => (
                                        <TaskPopup
                                            key={event.id}
                                            project_id={currentProjectId}
                                            task_id={Number(event.id)}
                                            buttonClassName="event-block"
                                        >
                                            <div
                                                className="event-block"
                                                style={{
                                                    backgroundColor: event.color,
                                                    padding: "4.8px 8px",
                                                }}
                                            >
                                                {localizeTitle(event.title)}
                                            </div>
                                        </TaskPopup>
                                    ))}
                                {events.filter(event => isStartOrEndDate(date, event.startDate, event.endDate)).length > maxEventsPerDay && (
                                    <button
                                        className="more-events"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openAllEvents(date);
                                        }}
                                    >
                                        {`+ ${events.filter(event => isStartOrEndDate(date, event.startDate, event.endDate)).length - maxEventsPerDay} ${t("calendar.calendarGrid.more")}`}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {showTaskForm && (
                    <ul>
                        {events.map((task) => (
                            <li key={task.id}>
                                <TaskForm
                                    project_id={currentProjectId}
                                    task_id={task.id}
                                    onClose={() => setShowTaskForm(false)}
                                    onSave={handleTaskSave}
                                />
                                <button onClick={() => toggleTaskSelection(task.id)}>
                                    {selectedTasks.has(task.id) ? "Deselect" : "Select"}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                {allEventsDate && allEventsForDate.length > 0 && (
                    <AllEventsPopup
                        date={allEventsDate}
                        tasks={allEventsForDate}
                        onClose={closeAllEvents}
                    />
                )}
            </div>
        </>
    );
};

export default CalendarGrid;
