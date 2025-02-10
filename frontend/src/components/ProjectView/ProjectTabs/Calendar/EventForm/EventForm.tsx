import React, { useEffect, useRef } from 'react';
import './EventForm.css';
import Clock from '../../../../../assets/Icons/Clock.svg';
import Text from '../../../../../assets/Icons/Text.svg';
import DropdownDatePicker from '../../../../Dropdowns/DropdownDatePicker/DropdownDatePicker';
import { useTranslation } from 'react-i18next';

type EventFormProps = {
    isOpen: boolean;
    onClose: () => void;
    onSaveEvent: (eventData: {
        title: string;
        startDate: string;
        endDate: string;
        note: string;
    }) => void;
    title: string;
    setTitle: (title: string) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
    note: string;
    setNote: (note: string) => void;
};

const formatDate = (dateString: string, t: any) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const locale = t('calendar.eventForm.locale') || 'en-US';

    return date.toLocaleDateString(locale, options);
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
                                                 note,
                                                 setNote,
                                             }) => {
    const { t } = useTranslation();

    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return;

            if (event.key === 'Enter') {
                event.preventDefault();
                handleSaveEvent();
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, title, startDate, endDate, note]);

    const handleClickOutside = (event: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSaveEvent = () => {
        const eventData = {
            title: title.trim() === "" ? t('calendar.eventForm.defaultTitle') : title,
            startDate,
            endDate,
            note,
        };

        onSaveEvent(eventData);
        onClose();
    };

    const handleEndDateChange = (newEndDate: string) => {
        const newEndDateObj = new Date(newEndDate);
        const startDateObj = new Date(startDate);

        if (newEndDateObj < startDateObj) {
            alert(t('calendar.eventForm.endDateError'));
            return;
        }
        setEndDate(newEndDate);
    };

    if (!isOpen) return null;

    return (
        <div className="event-form-overlay">
            <div className="event-form" ref={formRef}>
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <div className="event-form-body">
                    <input
                        type="text"
                        className="event-title-input"
                        placeholder={t('calendar.eventForm.titlePlaceholder')}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="event-date-inputs">
                        <img src={Clock} alt={t('calendar.eventForm.startDate')} />
                        <DropdownDatePicker
                            className="event-start-date-picker"
                            title={t('calendar.eventForm.startDate')}
                            currentDate={new Date(startDate)}
                            onChange={setStartDate}
                        >
                            <p>{formatDate(startDate, t)}</p>
                        </DropdownDatePicker>
                        <span className="date-separator">-</span>
                        <DropdownDatePicker
                            className="event-end-date-picker"
                            title={t('calendar.eventForm.endDate')}
                            currentDate={new Date(endDate)}
                            onChange={handleEndDateChange}
                        >
                            <p>{formatDate(endDate, t)}</p>
                        </DropdownDatePicker>
                    </div>
                    <div className="event-note-input">
                        <img src={Text} alt={t('calendar.eventForm.note')} />
                        <textarea
                            className="note-input"
                            placeholder={t('calendar.eventForm.notePlaceholder')}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                    <button className="save-button" onClick={handleSaveEvent}>
                        {t('calendar.eventForm.saveButton')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventForm;
