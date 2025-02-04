import './DropdownRowPicker.css'

import React, {Children, PropsWithChildren, useRef} from "react";
import DropdownPicker from "../DropdownPicker/DropdownPicker.tsx";

type DropdownRowPickerProps = {
    icon: React.Element
    className: string
    title: string
    onChange: (arg0: any) => void
}


const DropdownRowPicker = (props: PropsWithChildren<DropdownRowPickerProps>) => {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
        <DropdownPicker
            icon={props.icon}
            buttonClassName={props.className}
            contentClassName='dropdown-row-picker-content'
            containerAlignment='flex-start'
            contentAlignment='flex-start'
            title={props.title}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
        >
            {Children.map(props.children, child => {
                if (!React.isValidElement(child)) {
                    return
                }

                return (
                    <button
                        onClick={(event) => {
                            event.stopPropagation()
                            props.onChange(child.props.value)
                            setIsVisible(false)
                        }}
                    >
                        {child}
                    </button>
                )
            })}
        </DropdownPicker>
    )
}

export default DropdownRowPicker;