import React, {PropsWithChildren, Children, useEffect, useRef} from "react";

type DropdownPickerContentProps = {
    contentAlignment: 'flex-start' | 'flex-end' | 'center'
    contentClassName: string
}

const DropdownPickerContent = (props: PropsWithChildren<DropdownPickerContentProps>) => {
    const containerRef = useRef(null);
    const divRef = useRef(null);

    const checkAndAdjustPosition = () => {
        if (containerRef.current && divRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const rect = divRef.current.getBoundingClientRect();
            const padding = 10;

            // Get viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // get offset for alignment
            const offset =  props.contentAlignment === 'flex-start' ? 0 :
                            props.contentAlignment === 'flex-end' ? rect.width :
                            props.contentAlignment === 'center' ? rect.width / 2 : 0

            let newTop = containerRect.top;
            let newLeft = containerRect.left - offset;

            // Check if the div is outside the viewport and adjust
            if (newTop < padding) {
                newTop = padding; // Bring into view from top
            }
            if (newLeft < padding) {
                newLeft = padding; // Bring into view from left
            }
            if (newTop + rect.height > viewportHeight - padding) {
                newTop = viewportHeight - rect.height - padding; // Bring into view from bottom
            }
            if (newLeft + rect.width > viewportWidth - padding) {
                newLeft = viewportWidth - rect.width - padding; // Bring into view from right
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
            className="dropdown-container"
            onClick={(event) => {
                event.stopPropagation()
            }}
            ref={containerRef}
        >
            <div
                className={`dropdown-content ${props.contentClassName}`}
                ref={divRef}
            >
                {Children.map(props.children, child => {
                    return child
                })}
            </div>
        </div>
    )
}

export default DropdownPickerContent;