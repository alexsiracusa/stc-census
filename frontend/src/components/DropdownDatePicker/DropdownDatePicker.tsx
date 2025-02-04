import './DropdownDatePicker.css'

import React, {Children, PropsWithChildren} from "react";
import DropdownPicker from "../DropdownPicker/DropdownPicker.tsx";

type DropdownDatePickerProps = {
    className: string
    title: string
    currentDate: Date
    onChange: (arg0: any) => void
}


const DropdownDatePicker = (props: PropsWithChildren<DropdownDatePickerProps>) => {
    const [isVisible, setIsVisible] = React.useState(false);

    const icon = <>{
        Children.map(props.children, child => {
            return child
        })
    }</>

    return (
        <DropdownPicker
            icon={icon}
            buttonClassName={props.className}
            contentClassName='dropdown-row-picker-content'
            containerAlignment='center'
            contentAlignment='center'
            title={props.title}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
        >
            <button
                onClick={() => {
                    props.onChange('3/14/25')
                    setIsVisible(false)
                }}
            >
                Pick a date lamo
            </button>
        </DropdownPicker>
    )
}

export default DropdownDatePicker;