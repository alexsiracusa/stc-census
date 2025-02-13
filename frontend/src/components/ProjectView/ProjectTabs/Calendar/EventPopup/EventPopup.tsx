import React, { useEffect, useRef } from "react";
import "./EventPopup.css";
import Trash from "../../../../../assets/Icons/Trash.svg";
import Edit from "../../../../../assets/Icons/Edit.svg";
import Email from "../../../../../assets/Icons/Email.svg";
import Close from "../../../../../assets/Icons/Close.svg";
import Text from "../../../../../assets/Icons/Text.svg";
import { useTranslation } from "react-i18next";

type EventPopupProps = {
    isOpen: boolean;
    onClose: () => void;
    eventData: {
        title: string;
        startDate: string;
        endDate: string;
        note: string;
    };
    onEdit: () => void;
    onDelete: () => void;
    onEmail: () => void;
    project_id: number;
    event_id: string;
};

const EventPopup: React.FC<EventPopupProps> = ({
                                                   isOpen,
                                                   onClose,
                                                   eventData,
                                                   onEdit,
                                                   onDelete,
                                                   onEmail,
                                               }) => {
    const { t } = useTranslation();
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
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

    const formatDate = (date: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            month: "long",
            day: "numeric",
        };
        return new Date(date).toLocaleDateString(undefined, options);
    };

    const formatDateRange = (start: string, end: string): string => {
        if (start === end) {
            return formatDate(start);
        } else {
            return `${formatDate(start)} - ${formatDate(end)}`;
        }
    };

    const getLocalizedTitle = () => {
        const localizedDefaultTitle = t("calendar.eventForm.defaultTitle");
        const previouslySavedDefaults = ["(No title)", "(无标题)"];
        return previouslySavedDefaults.includes(eventData.title)
            ? localizedDefaultTitle
            : eventData.title;
    };

    if (!isOpen) return null;

    return (
        <div className="event-popup-overlay">
            <div className="event-popup" ref={popupRef}>
                <div className="event-actions">
                    <button
                        className="icon-button"
                        onClick={onEdit}
                        title={t("calendar.eventPopup.edit")}
                    >
                        <img src={Edit} alt={t("calendar.eventPopup.edit")} />
                    </button>
                    <button
                        className="icon-button"
                        onClick={onDelete}
                        title={t("calendar.eventPopup.delete")}
                    >
                        <img src={Trash} alt={t("calendar.eventPopup.delete")} />
                    </button>
                    <button
                        className="icon-button"
                        onClick={onEmail}
                        title={t("calendar.eventPopup.email")}
                    >
                        <img src={Email} alt={t("calendar.eventPopup.email")} />
                    </button>
                    <button
                        className="icon-button"
                        onClick={onClose}
                        title={t("calendar.eventPopup.close")}
                    >
                        <img src={Close} alt={t("calendar.eventPopup.close")} />
                    </button>
                </div>
                <div className="event-popup-header">
                    <div className="header-top">
                        <div className="event-details">
                            <h3 className="event-title">{getLocalizedTitle()}</h3>
                            <p className="event-date">
                                {formatDateRange(eventData.startDate, eventData.endDate)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="event-popup-body">
                    {eventData.note && (
                        <div className="event-note">
                            <img src={Text} alt={t("calendar.eventPopup.note")} />
                            <p>{eventData.note}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventPopup;