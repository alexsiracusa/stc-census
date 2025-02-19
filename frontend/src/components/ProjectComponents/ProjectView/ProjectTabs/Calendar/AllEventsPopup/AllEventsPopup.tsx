import React, { useEffect, useRef } from "react";
import "./AllEventsPopup.css";
import { useTranslation } from "react-i18next";
import { Task } from "../../../../../../types/Task";
import TaskPopup from "../../../../../TaskComponents/TaskPopup/TaskPopup";

type AllEventsPopupProps = {
    date: Date;
    tasks: (Task & { color: string; description?: string; })[];
    onClose: () => void;
    openTaskDetails: (taskId: string) => void;
};

const AllEventsPopup: React.FC<AllEventsPopupProps> = ({
                                                           date,
                                                           tasks,
                                                           onClose,
                                                           openTaskDetails,
                                                       }) => {
    const { t } = useTranslation();
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        window.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        };

        const formatter = new Intl.DateTimeFormat(undefined, options);
        const parts = formatter.formatToParts(date);

        return parts
            .map((part) => {
                switch (part.type) {
                    case "weekday":
                        return t(`calendar.days.${part.value.toLowerCase()}`);
                    case "month":
                        return t(`calendar.months.${part.value.toLowerCase()}`);
                    case "day":
                    case "year":
                    default:
                        return part.value;
                }
            })
            .join("");
    };

    return (
        <div className="all-events-overlay">
            <div className="all-events-content" ref={popupRef}>
                <div className="all-events-header">
                    <h3>{t("calendar.allEventsPopup.title")}</h3>
                    <p className="all-events-date">{formatDate(date)}</p>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="all-events-body">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskPopup
                                key={task.id}
                                project_id={task.project_id}
                                task_id={Number(task.id)}
                                buttonClassName="event-item"
                            >
                                <div
                                    style={{
                                        backgroundColor: task.color,
                                    }}
                                    onClick={() => openTaskDetails(task.id.toString())}
                                >
                                    <strong>{task.name}</strong>
                                    {task.description && <p>{task.description}</p>}
                                    <span className="event-time">
                                        {`${task.target_start_date || "N/A"} - ${task.target_completion_date || "N/A"}`}
                                    </span>
                                </div>
                            </TaskPopup>
                        ))
                    ) : (
                        <p className="no-tasks">{t("calendar.allEventsPopup.noTasks")}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllEventsPopup;
