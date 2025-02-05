import React from 'react';
import './CalendarHeader.css';
import ChevronRight from '../../../../assets/Icons/ChevronRight.svg';
import ChevronLeft from '../../../../assets/Icons/ChevronLeft.svg';
import {useTranslation} from "react-i18next";
import {format} from "date-fns";

type CalendarHeaderProps = {
    currentMonth: Date;
    onNavigate: (direction: number) => void;
    onResetToToday: () => void;
};

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentMonth, onNavigate, onResetToToday }) => {
    const {t} = useTranslation();

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
                {t('calendar.months.' + format(currentMonth, 'MMMM').toLowerCase())}
                {' '} {currentMonth.getFullYear()}
            </h2>
        </header>
    );
};

export default CalendarHeader;
