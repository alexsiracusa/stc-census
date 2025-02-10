import React, { useEffect, useRef } from 'react';
import './EventPopup.css';
import Trash from '../../../../../assets/Icons/Trash.svg';
import Edit from '../../../../../assets/Icons/Edit.svg';
import Email from '../../../../../assets/Icons/Email.svg';
import Close from '../../../../../assets/Icons/Close.svg';
import ShareLink from '../../../../../assets/Icons/ShareLink.svg';
import { useTranslation } from 'react-i18next';

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
    onShare: () => void;
    onEmail: () => void;
};

const EventPopup: React.FC<EventPopupProps> = ({
                                                   isOpen,
                                                   onClose,
                                                   eventData,
                                                   onEdit,
                                                   onDelete,
                                                   onShare,
                                                   onEmail,
                                               }) => {
    const { t } = useTranslation();
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleClickOutside = (event: MouseEvent) => {
        if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
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
    }, [isOpen, onClose]);

    const formatDateRange = (start: string, end: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        };
        const startDate = new Date(start).toLocaleDateString(undefined, options);
        const endDate = new Date(end).toLocaleDateString(undefined, options);
        return startDate === endDate ? startDate : `${startDate} – ${endDate}`;
    };

    if (!isOpen) return null;

    return (
        <div className="event-popup-overlay">
            <div className="event-popup" ref={popupRef}>
                <div className="event-popup-header">
                    <div className="color-indicator"></div>
                    <div className="event-details">
                        <h3 className="event-title">
                            {eventData.title.trim() === ''
                                ? t('calendar.eventPopup.defaultTitle')
                                : eventData.title
                            }
                        </h3>
                        <p className="event-date">
                            {formatDateRange(eventData.startDate, eventData.endDate)}
                        </p>
                    </div>
                    <div className="event-actions">
                        <button className="icon-button" onClick={onEdit} title={t('calendar.eventPopup.edit')}>
                            <img src={Edit} alt={t('calendar.eventPopup.edit')} />
                        </button>
                        <button className="icon-button" onClick={onDelete} title={t('calendar.eventPopup.delete')}>
                            <img src={Trash} alt={t('calendar.eventPopup.delete')} />
                        </button>
                        <button className="icon-button" onClick={onEmail} title={t('calendar.eventPopup.email')}>
                            <img src={Email} alt={t('calendar.eventPopup.email')} />
                        </button>
                        <button className="icon-button" onClick={onClose} title={t('calendar.eventPopup.close')}>
                            <img src={Close} alt={t('calendar.eventPopup.close')} />
                        </button>
                    </div>
                </div>
                <div className="event-popup-body">
                    <button className="share-button" onClick={onShare}>
                        <img src={ShareLink} alt={t('calendar.eventPopup.share')} /> {t('calendar.eventPopup.inviteViaLink')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventPopup;
