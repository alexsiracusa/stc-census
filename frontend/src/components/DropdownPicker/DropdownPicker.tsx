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

const findNearestScrollableParent = (element) => {
    let parent = element.parentNode;

    while (parent) {
        if (!(parent instanceof Element)) { break; }
        const style = window.getComputedStyle(parent);

        const overflowY = style.overflowY;
        const overflowX = style.overflowX;

        const isScrollableY = (overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight;
        const isScrollableX = (overflowX === 'auto' || overflowX === 'scroll') && parent.scrollWidth > parent.clientWidth;

        if (isScrollableY || isScrollableX) {
            return parent;
        }

        parent = parent.parentNode; // Step up to the next parent
    }

    return null; // No scrollable parent found
};


const DropdownPicker = (props: PropsWithChildren<DropdownProps>) => {
    const [fixedPosition, setFixedPosition] = useState(0); // Initial position
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            // Find the nearest scrollable parent dynamically
            const scrollableParent = findNearestScrollableParent(ref.current);

            if (scrollableParent) {

                // Optionally, listen to scroll events on the scrollable parent
                const handleScroll = () => {
                    setFixedPosition(scrollableParent.scrollLeft)
                    // console.log('ScrollTop:', scrollableParent.scrollTop, 'ScrollLeft:', scrollableParent.scrollLeft);
                };

                scrollableParent.addEventListener('scroll', handleScroll);

                return () => {
                    scrollableParent.removeEventListener('scroll', handleScroll); // Cleanup on unmount
                };
            }
        }
    }, []);

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
                        style={{ transform: `translate(-${fixedPosition}px, 0)` }}
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