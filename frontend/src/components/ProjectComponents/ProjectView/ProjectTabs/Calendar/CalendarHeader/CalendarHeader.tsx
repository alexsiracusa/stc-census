import React from 'react';
import './CalendarHeader.css';
import ChevronRight from '../../../../../../assets/Icons/ChevronRight.svg';
import ChevronLeft from '../../../../../../assets/Icons/ChevronLeft.svg';
import DoubleChevronLeft from '../../../../../../assets/Icons/DoubleChevronLeft.svg';
import DoubleChevronRight from '../../../../../../assets/Icons/DoubleChevronRight.svg';
import { useTranslation } from "react-i18next";

type CalendarHeaderProps = {
    currentMonth: Date;
    onNavigate: (direction: number) => void;
    onResetToToday: () => void;
};

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentMonth, onNavigate, onResetToToday }) => {
    const { t } = useTranslation();

    return (
        <header className="calendar-header">
            <button className="today-button" onClick={onResetToToday}>
                {t('calendar.calendarHeader.today')}
            </button>
                <button className="nav-button nav-button-previous-year" onClick={() => onNavigate(-12)}>
                    <img src={DoubleChevronLeft} alt={t('calendar.calendarHeader.previousYear')} />
                </button>
                <button className="nav-button nav-button-previous-month" onClick={() => onNavigate(-1)}>
                    <img src={ChevronLeft} alt={t('calendar.calendarHeader.previousMonth')} />
                </button>
                <button className="nav-button nav-button-next-month" onClick={() => onNavigate(1)}>
                    <img src={ChevronRight} alt={t('calendar.calendarHeader.nextMonth')} />
                </button>
                <button className="nav-button nav-button-next-year" onClick={() => onNavigate(12)}>
                    <img src={DoubleChevronRight} alt={t('calendar.calendarHeader.nextYear')} />
                </button>
            <h2>
                {t('calendar.months.' + currentMonth.toLocaleString('default', { month: 'long' }).toLowerCase())}
                {' '} {currentMonth.getFullYear()}
            </h2>
        </header>
    );
};

export default CalendarHeader;
