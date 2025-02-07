import './DropdownDatePicker.css'

import React, {Children, PropsWithChildren, useState} from "react";
import DropdownPicker from "../DropdownPicker/DropdownPicker.tsx";
import getCalendarDays from "../../../utils/getCalendarDays.ts";
import {isSameDay, format} from 'date-fns';
import {useTranslation} from "react-i18next";

import ChevronLeft from '../../../assets/Icons/ChevronLeft.svg'
import DoubleChevronLeft from '../../../assets/Icons/DoubleChevronLeft.svg'
import ChevronRight from '../../../assets/Icons/ChevronRight.svg'
import DoubleChevronRight from '../../../assets/Icons/DoubleChevronRight.svg'


type DropdownDatePickerProps = {
    className: string
    title: string
    currentDate: Date
    onChange: (arg0: any) => void
}


const DropdownDatePicker = (props: PropsWithChildren<DropdownDatePickerProps>) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [currentMonth, setCurrentMonth] = useState(props.currentDate);
    const calendarDays = getCalendarDays(currentMonth)
    const {t} = useTranslation();

    const icon = <>{
        Children.map(props.children, child => {
            return child
        })
    }</>

    const setMonth = (dir: number) => {
        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + dir, 1);
        setCurrentMonth(nextMonth);
    }

    return (
        <DropdownPicker
            icon={icon}
            buttonClassName={props.className}
            contentClassName='dropdown-date-picker-content'
            containerAlignment='center'
            contentAlignment='center'
            title={props.title}
            isVisible={isVisible}
            setIsVisible={(value) => {
                if (!value) {
                    setCurrentMonth(props.currentDate)
                }
                setIsVisible(value)
            }}
        >
            <div className='date-picker-calendar'>
                <div className='month-selector'>
                    <button onClick={() => {
                        setMonth(-12)
                    }}>
                        <img src={DoubleChevronLeft}/>
                    </button>

                    <button onClick={() => {
                        setMonth(-1)
                    }}>
                        <img src={ChevronLeft}/>
                    </button>

                    <p>{`${t('calendar.months.' + format(currentMonth, 'MMMM').toLowerCase())} ${format(currentMonth, 'yy')}`}</p>

                    <button onClick={() => {
                        setMonth(1)
                    }}>
                        <img src={ChevronRight}/>
                    </button>

                    <button onClick={() => {
                        setMonth(12)
                    }}>
                        <img src={DoubleChevronRight}/>
                    </button>
                </div>
                <div className="date-picker-calendar-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="weekday">
                            <p>{t(`calendar.days.${day.toLowerCase()}`)}</p>
                        </div>
                    ))}
                    {calendarDays.map(({date, isCurrentMonth}, index) => (
                        <div
                            key={index}
                            className={`day-cell ${isCurrentMonth ? '' : 'other-month'} ${date === props.currentDate ? 'today' : ''}`}
                        >
                            <button
                                className={`day-number ${isSameDay(date, props.currentDate) ? 'selected' : ''}`}
                                onClick={() => {
                                    props.onChange(format(date, 'yyyy-MM-dd'))
                                    setIsVisible(false)
                                    setCurrentMonth(date)
                                }}
                            >
                                <p>{date.getDate()}</p>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </DropdownPicker>
    )
}

export default DropdownDatePicker;