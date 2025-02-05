import './DropdownDatePicker.css'

import React, {Children, PropsWithChildren, useState} from "react";
import DropdownPicker from "../DropdownPicker/DropdownPicker.tsx";
import getCalendarDays from "../../utils/getCalendarDays.ts";
import {isSameDay, format} from 'date-fns';

import ChevronLeft from '../../assets/Icons/ChevronLeft.svg'
import ChevronRight from '../../assets/Icons/ChevronRight.svg'

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

    const icon = <>{
        Children.map(props.children, child => {
            return child
        })
    }</>

    const setMonth = (dir: number) => {
        const nextMonth = new Date(currentMonth);
        nextMonth.setMonth(nextMonth.getMonth() + dir);
        setCurrentMonth(nextMonth);
    }

    return (
        <DropdownPicker
            icon={icon}
            buttonClassName={props.className}
            contentClassName='dropdown-row-picker-content'
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
                        setMonth(-1)
                    }}>
                        <img src={ChevronLeft}/>
                    </button>

                    <p>{format(currentMonth, 'MMMM yy')}</p>

                    <button onClick={() => {
                        setMonth(1)
                    }}>
                        <img src={ChevronRight}/>
                    </button>
                </div>
                <div className="date-picker-calendar-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayKey) => (
                        <div key={dayKey} className="weekday">
                            <p>{dayKey}</p>
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