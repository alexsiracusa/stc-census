import './DropdownPicker.css'

import React, {PropsWithChildren, useRef} from "react";
import useOutsideAlerter from "../../../../hooks/useOutsideAlerter.ts";
import DropdownPickerContent from "./DropdownPickerContent.tsx";

type DropdownProps = {
    icon: React.Element
    buttonClassName: string
    contentClassName: string
    containerAlignment: 'flex-start' | 'flex-end' | 'center'
    contentAlignment: 'flex-start' | 'flex-end' | 'center'
    title: string
    isVisible: boolean
    setIsVisible: (boolean) => void
}

const DropdownPicker = (props: PropsWithChildren<DropdownProps>) => {
    const ref = useRef(null);

    const closeDropdown = () => {
        if (props.isVisible) {
            props.setIsVisible(false)
        }
    }

    useOutsideAlerter(ref, closeDropdown);

    return (
        <div
            className="dropdown"
            ref={ref}
            style={{
                alignItems: props.containerAlignment
            }}
        >
            <button
                className={props.buttonClassName}
                title={props.title}
                onClick={(event) => {
                    event.stopPropagation()
                    props.setIsVisible(!props.isVisible)
                }}
            >
                {props.icon}
            </button>

            {props.isVisible && (
                <DropdownPickerContent
                    contentAlignment={props.contentAlignment}
                    contentClassName={props.contentClassName}
                    children={props.children}
                />
            )}
        </div>
    )
}

export default DropdownPicker;