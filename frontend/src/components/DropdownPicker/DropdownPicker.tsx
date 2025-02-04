import './DropdownPicker.css'

import React, {Children, PropsWithChildren, useRef, useState, useEffect} from "react";
import useOutsideAlerter from "../../hooks/useOutsideAlerter.ts";

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
    const [fixedPosition, setFixedPosition] = useState(0); // Initial position
    const ref = useRef(null);

    const closeDropdown = () => {
        props.setIsVisible(false);
    }

    useOutsideAlerter(ref, closeDropdown);
    const handleScroll = () => {
        console.log("handle scroll")
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect()
            console.log(rect.x, rect.y, rect.top, rect.bottom)
            setFixedPosition(rect.x);
        }
    };

    useEffect(() => {
        const scrollContainer = ref.current;
        scrollContainer.addEventListener('scroll', handleScroll);
        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
        };
    }, []);

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
                <div
                    className="dropdown-container"
                    style={{
                        justifyContent: props.contentAlignment
                    }}
                    onClick={(event) => {
                        event.stopPropagation()
                    }}
                >
                    <div
                        className={`dropdown-content ${props.contentClassName}`}
                        style={{ offset: `0 ${fixedPosition}px` }}
                    >
                        {Children.map(props.children, child => {
                            return child
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default DropdownPicker;