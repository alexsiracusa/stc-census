import React from 'react';
import './AllEventsPopup.css';
import { useTranslation } from 'react-i18next';

type AllEventsPopupProps = {
    date: Date;
    events: {
        id: string;
        title: string;
        startDate: string;
        endDate: string;
        description?: string;
    }[];
    onClose: () => void;
    openEventDetails: (eventId: string) => void;
};

const AllEventsPopup: React.FC<AllEventsPopupProps> = ({ date, events, onClose, openEventDetails }) => {
    const { t } = useTranslation();

    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        };

        const formatter = new Intl.DateTimeFormat(undefined, options);
        const parts = formatter.formatToParts(date);

        return parts.map(part => {
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
        }).join('');
    };


    const handleEventClick = (eventId: string) => {
        openEventDetails(eventId);
        onClose();
    };

    return (
        <div className="all-events-overlay">
            <div className="all-events-content">
                <div className="all-events-header">
                    <h3>{t('calendar.allEventsPopup.title')}</h3>
                    <p className="all-events-date">
                        {formatDate(date)}
                    </p>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="all-events-body">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div
                                key={event.id}
                                className="event-item"
                                onClick={() => handleEventClick(event.id)}
                            >
                                <strong>{event.title}</strong>
                                <span className="event-time">
                                    {`${event.startDate} - ${event.endDate}`}
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
