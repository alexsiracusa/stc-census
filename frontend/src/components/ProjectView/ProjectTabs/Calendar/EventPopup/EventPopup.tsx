import { PropsWithChildren, useEffect, useRef } from "react";
import "./EventPopup.css";
import { useTranslation } from "react-i18next";
import Path from "../../../../Path/Path.tsx";
import { useSelector } from "react-redux";
import TaskFields from "../../../../TaskComponents/TaskFields/TaskFields.tsx";
import TaskStatusSelector from "../../../../TaskComponents/TaskRow/TaskStatusSelector/TaskStatusSelector.tsx";
import TaskDescription from "../../../../TaskComponents/TaskDescription/TaskDescription.tsx";
import TaskName from "../../../../TaskComponents/TaskName/TaskName.tsx";
import Popup from "../../../../Popup/Popup.tsx";

type EventPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    eventData: {
        title: string;
        startDate: string;
        endDate: string;
        note: string;
    };
    project_id: number;
    event_id: string;
};

const EventPopup: React.FC<PropsWithChildren<EventPopupProps>> = ({
                                                                      isOpen,
                                                                      onClose,
                                                                      eventData,
                                                                      project_id,
                                                                      event_id,
                                                                  }) => {
    const { t } = useTranslation();
    const popupRef = useRef<HTMLDivElement>(null);

    const project = useSelector((state) => state.projects.byId[project_id]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!project_id || !project) {
        console.error(`Error: Project with id ${project_id} not found in Redux store.`);
        return (
            <div className="event-popup-overlay">
                <div className="event-popup" ref={popupRef}>
                    <h3>Error: Project not found</h3>
                    <button onClick={onClose}>{t("calendar.eventPopup.close")}</button>
                </div>
            </div>
        );
    }

    const formatDate = (date: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const formatDateRange = (start: string, end: string): string => {
        const startFormatted = formatDate(start);
        const endFormatted = formatDate(end);
        return start === end ? startFormatted : `${startFormatted} - ${endFormatted}`;
    };

    return (
        <Popup
            icon={<div></div>}
            buttonClassName="open-event-popup"
            contentClassName="event-popup-content"
            title={eventData.title}
            isVisible={true}
            setIsVisible={() => {}}
            transparentBackground={false}
        >
            <div className="event-detail" ref={popupRef}>
                <div className="event-header">
                    <Path path={[{ name: t("projectPath.title"), link: "/projects" }, ...project.path]} />
                </div>
                <div className="event-fields">
                    <div className="event-field event-name">
                        <h3>{t("task.name")}</h3>
                        <TaskName project_id={project_id} task_id={Number(event_id)} />
                    </div>
                    <div className="event-field event-status">
                        <h3>{t("task.statusTitle")}</h3>
                        <TaskStatusSelector project_id={project_id} task_id={Number(event_id)} />
                    </div>
                    <div className="event-field event-description">
                        <h3>{t("task.descriptionLabel")}</h3>
                        <TaskDescription project_id={project_id} task_id={Number(event_id)} />
                    </div>
                    <div className="event-field event-custom-fields">
                        <h3>{t("task.customFields")}</h3>
                        <TaskFields project_id={project_id} task_id={Number(event_id)} />
                    </div>
                    <div className="event-field event-dates">
                        <h3>{t("calendar.eventPopup.dates")}</h3>
                        <p>{formatDateRange(eventData.startDate, eventData.endDate)}</p>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default EventPopup;
