import React from 'react';
import './Calendar.css';
import ChevronRight from '../../../../assets/Icons/ChevronRight.svg';
import ChevronLeft from '../../../../assets/Icons/ChevronLeft.svg';

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
                    <img src={ChevronLeft} alt="Navigate Left" />
                </button>
                <button className="nav-button" onClick={() => onNavigate(1)}>
                    <img src={ChevronRight} alt="Navigate Right" />
                </button>
            </div>
            <h2>
                {currentMonthName} {currentMonth.getFullYear()}
            </h2>
        </header>
    );
};

export default CalendarHeader;
