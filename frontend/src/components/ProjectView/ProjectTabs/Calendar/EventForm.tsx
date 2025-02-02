import React from 'react';
import './Calendar.css';

type EventFormProps = {
    isOpen: boolean;
    onClose: () => void;
    onSaveEvent: () => void;
    title: string;
    setTitle: (title: string) => void;
    date: string;
    setDate: (date: string) => void;
    description: string;
    setDescription: (desc: string) => void;
};

const EventForm: React.FC<EventFormProps> = ({ isOpen, onClose, onSaveEvent, title, setTitle, date, setDate, description, setDescription }) => {
    if (!isOpen) return null;

    return (
        <div className="event-form-overlay">
            <div className="event-form">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <div className="event-form-body">
                    <input
                        type="text"
                        className="event-title-input"
                        placeholder="Add Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="date"
                        className="event-date-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                    <textarea
                        className="event-description-input"
                        placeholder="Add Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button className="save-button" onClick={onSaveEvent}>
                        Save Event
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventForm;
