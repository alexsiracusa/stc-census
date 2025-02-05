import React from 'react';
import './AllEventsPopup.css';

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
    const handleEventClick = (eventId: string) => {
        openEventDetails(eventId);
        onClose();
    };

    return (
        <div className="all-events-overlay">
            <div className="all-events-content">
                <div className="all-events-header">
                    <h3>All Events</h3>
                    <p className="all-events-date">
                        {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
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
                                    {event.startDate} - {event.endDate}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="no-events">No events scheduled for this day.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllEventsPopup;
