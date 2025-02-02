import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './Calendar.css';

type CalendarHeaderProps = {
    currentMonth: Date;
    onNavigate: (direction: number) => void;
    onResetToToday: () => void;
};

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentMonth, onNavigate, onResetToToday }) => {
    const currentMonthName = currentMonth.toLocaleString('default', { month: 'long' });

    return (
        <header className="calendar-header">
            <button className="today-button" onClick={onResetToToday}>
                Today
            </button>
            <div className="nav-buttons">
                <button className="nav-button" onClick={() => onNavigate(-1)}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button className="nav-button" onClick={() => onNavigate(1)}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
            <h2>
                {currentMonthName} {currentMonth.getFullYear()}
            </h2>
        </header>
    );
};

export default CalendarHeader;
