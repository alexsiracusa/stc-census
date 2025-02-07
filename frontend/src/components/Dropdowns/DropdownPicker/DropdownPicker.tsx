import './DropdownPicker.css'

import React, {Children, PropsWithChildren, useRef, useState, useEffect} from "react";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter.ts";

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
        if (!(parent instanceof Element)) {
            break;
        }
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
    const divRef = useRef(null);

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

    const checkAndAdjustPosition = () => {
        if (divRef.current) {
            const rect = divRef.current.getBoundingClientRect();

            // Get viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            console.log('checking bounds')

            let newTop = rect.top;
            let newLeft = rect.left;

            // Check if the div is outside the viewport and adjust
            if (rect.top < 0) {
                newTop = 0; // Bring into view from top
            }
            if (rect.left < 0) {
                newLeft = 0; // Bring into view from left
            }
            if (rect.bottom > viewportHeight) {
                newTop = viewportHeight - rect.height; // Bring into view from bottom
            }
            if (rect.right > viewportWidth) {
                newLeft = viewportWidth - rect.width; // Bring into view from right
            }

            // Apply new position if needed
            divRef.current.style.top = `${newTop}px`;
            divRef.current.style.left = `${newLeft}px`;
        }
    };

    useEffect(() => {
        // Check on mount
        checkAndAdjustPosition();

        // Optional: Check on window resize
        window.addEventListener("resize", checkAndAdjustPosition);

        return () => {
            window.removeEventListener("resize", checkAndAdjustPosition);
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
                    checkAndAdjustPosition()
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
                        style={{transform: `translate(-${fixedPosition}px, 0)`}}
                        ref={divRef}
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