import React from 'react';
import './EventForm.css';
import Clock from '../../../../assets/Icons/Clock.svg';
import Text from '../../../../assets/Icons/Text.svg';
import Organizer from '../../../../assets/Icons/Organizer.svg';

type EventFormProps = {
    isOpen: boolean;
    onClose: () => void;
    onSaveEvent: (eventData: {
        title: string;
        startDate: string;
        endDate: string;
        description: string;
        organizer: string;
    }) => void;
    title: string;
    setTitle: (title: string) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
    description: string;
    setDescription: (desc: string) => void;
    organizer: string;
    setOrganizer: (org: string) => void;
};

const EventForm: React.FC<EventFormProps> = ({
                                                 isOpen,
                                                 onClose,
                                                 onSaveEvent,
                                                 title,
                                                 setTitle,
                                                 startDate,
                                                 setStartDate,
                                                 endDate,
                                                 setEndDate,
                                                 description,
                                                 setDescription,
                                                 organizer,
                                                 setOrganizer,
                                             }) => {
    if (!isOpen) return null;

    const handleSaveEvent = () => {
        const eventData = {
            title: title.trim() === "" ? "(No title)" : title,
            startDate,
            endDate,
            description,
            organizer,
        };

        onSaveEvent(eventData);
        onClose();
    };

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
                    <div className="event-date-inputs">
                        <img src={Clock} alt="Clock" />
                        <input
                            type="date"
                            className="event-start-date-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <span className="date-separator">-</span>
                        <input
                            type="date"
                            className="event-end-date-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="event-description-input">
                        <img src={Text} alt="Text" />
                        <textarea
                            className="description-input"
                            placeholder="Add Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="event-organizer-input">
                        <img src={Organizer} alt="Organizer" />
                        <input
                            type="text"
                            className="organizer-input"
                            placeholder="Add Organizer"
                            value={organizer}
                            onChange={(e) => setOrganizer(e.target.value)}
                        />
                    </div>
                    <button className="save-button" onClick={handleSaveEvent}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventForm;
