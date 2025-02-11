import React, {PropsWithChildren, Children, useEffect, useRef} from "react";

type DropdownPickerContentProps = {
    contentAlignment: 'flex-start' | 'flex-end' | 'center'
    contentClassName: string
    fixedPosition: { x: number, y: number }
}

const DropdownPickerContent = (props: PropsWithChildren<DropdownPickerContentProps>) => {
    const divRef = useRef(null);

    const checkAndAdjustPosition = () => {
        if (divRef.current) {
            const rect = divRef.current.getBoundingClientRect();
            const padding = 10;

            // Get viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let newTop = rect.top;
            let newLeft = rect.left;

            // Check if the div is outside the viewport and adjust
            if (rect.top < padding) {
                newTop = padding; // Bring into view from top
            }
            if (rect.left < padding) {
                newLeft = padding; // Bring into view from left
            }
            if (rect.bottom > viewportHeight - padding) {
                newTop = viewportHeight - rect.height - padding; // Bring into view from bottom
            }
            if (rect.right > viewportWidth - padding) {
                newLeft = viewportWidth - rect.width - padding; // Bring into view from right
            }

            // Apply new position if needed
            divRef.current.style.top = `${newTop + props.fixedPosition.y}px`;
            divRef.current.style.left = `${newLeft + props.fixedPosition.x}px`;
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
            style={{
                justifyContent: props.contentAlignment
            }}
            onClick={(event) => {
                event.stopPropagation()
            }}
        >
            <div
                className={`dropdown-content ${props.contentClassName}`}
                style={{transform: `translate(-${props.fixedPosition.x}px, -${props.fixedPosition.y}px)`}}
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