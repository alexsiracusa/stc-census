import React, { useEffect, useRef } from 'react';
import './AllEventsPopup.css';
import { useTranslation } from 'react-i18next';
import { Task } from '../../../../../../types/Task.ts';  // Adjust the import path if necessary

type AllEventsPopupProps = {
    date: Date;
    tasks: Task[]; // Use the Task interface defined in Task.ts
    onClose: () => void;
    openTaskDetails: (taskId: number) => void; // Accept a number for Task ID
};

const AllEventsPopup: React.FC<AllEventsPopupProps> = ({ date, tasks, onClose, openTaskDetails }) => {
    const { t } = useTranslation();
    const popupRef = useRef<HTMLDivElement>(null);

    // Close popup on 'Escape' key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    // Close popup on outside click
    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Format the date for display
    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        };

        const formatter = new Intl.DateTimeFormat(undefined, options);
        const parts = formatter.formatToParts(date);

        return parts
            .map((part) => {
                switch (part.type) {
                    case 'weekday':
                        return t(`calendar.days.${part.value.toLowerCase()}`);
                    case 'month':
                        return t(`calendar.months.${part.value.toLowerCase()}`);
                    case 'day':
                    case 'year':
                    default:
                        return part.value;
                }
            })
            .join(' ');
    };

    const handleTaskClick = (taskId: number) => {
        openTaskDetails(taskId);
        onClose();
    };

    return (
        <div className="all-events-overlay">
            <div className="all-events-content" ref={popupRef}>
                <div className="all-events-header">
                    <h3>{t('calendar.allEventsPopup.title')}</h3>
                    <p className="all-events-date">{formatDate(date)}</p>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="all-events-body">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <div
                                key={task.id}
                                style={{ backgroundColor: task.status === 'Completed' ? 'lightgreen' : 'lightcoral' }} // Example color logic
                                className="event-item"
                                onClick={() => handleTaskClick(task.id)}
                            >
                                <strong>{task.name}</strong>
                                <span className="event-time">
                                    {`${task.target_start_date || 'N/A'} - ${task.target_completion_date || 'N/A'}`}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="no-events">{t('calendar.allEventsPopup.noEvents')}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllEventsPopup;
