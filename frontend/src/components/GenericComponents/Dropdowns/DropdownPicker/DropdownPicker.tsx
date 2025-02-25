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
    const [fixedPosition, setFixedPosition] = useState({x: 0, y: 0}); // Initial position
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            // Find the nearest scrollable parent dynamically
            const scrollableParents = findScrollableParents(ref.current);
            const cleanupArray = []

            scrollableParents.forEach((scrollableParent) => {
                const handleScroll = () => {
                    setFixedPosition({
                        x: fixedPosition.x + scrollableParent.scrollLeft,
                        y: fixedPosition.y + scrollableParent.scrollTop
                    })
                };

                scrollableParent.addEventListener('scroll', handleScroll);

                cleanupArray.push({
                    scrollable: scrollableParent,
                    handleScroll: handleScroll
                })
            })

            return () => {
                cleanupArray.forEach(({scrollable, handleScroll}) => {
                    scrollable.removeEventListener('scroll', handleScroll); // Cleanup on unmount
                })
            };
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
                <DropdownPickerContent
                    contentAlignment={props.contentAlignment}
                    contentClassName={props.contentClassName}
                    fixedPosition={fixedPosition}
                    children={props.children}
                />
            )}
        </div>
    )
}

export default DropdownPicker;