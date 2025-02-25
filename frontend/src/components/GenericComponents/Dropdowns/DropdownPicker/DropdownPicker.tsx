import './DropdownPicker.css'

import React, {PropsWithChildren, useRef, useState, useEffect} from "react";
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

const findScrollableParents = (element) => {
    const scrollable = []
    let parent = element.parentNode;

    while (parent) {
        if (!(parent instanceof Element)) {
            break;
        }
        const style = window.getComputedStyle(parent);

        const overflowY = style.overflowY;
        const overflowX = style.overflowX;

        const isScrollableY = (overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight;
        const isScrollableX = (overflowX === 'auto' || overflowX === 'scroll') && parent.scrollWidth > parent.clientWidth;

        if (isScrollableY || isScrollableX) {
            scrollable.push(parent)
            // return parent;
        }

        parent = parent.parentNode; // Step up to the next parent
    }

    return scrollable; // No scrollable parent found
};


const DropdownPicker = (props: PropsWithChildren<DropdownProps>) => {
    const ref = useRef(null);

    const closeDropdown = () => {
        props.setIsVisible(false);
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