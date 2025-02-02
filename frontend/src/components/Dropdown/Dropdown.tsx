import './Dropdown.css'

import React, {Children, PropsWithChildren, useRef, useEffect} from "react";

type DropdownProps = {
    icon: React.Element
    className: string
    title: string
    onChange: (arg0: any) => void
}


const Dropdown = (props: PropsWithChildren<DropdownProps>) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const ref = useRef(null);
    useOutsideAlerter(ref);

    function useOutsideAlerter(ref) {
        useEffect(() => {
            function handleClickOutside(event) {
                if (ref.current && !ref.current.contains(event.target)) {
                    closeDropdown()
                }
            }

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    const closeDropdown = () => {
        setIsVisible(false);
    }

    return (
        <div className="dropdown" ref={ref}>
            <button
                className={props.className}
                title={props.title}
                onClick={(event) => {
                    event.stopPropagation()
                    setIsVisible(!isVisible)
                }}
            >
                {props.icon}
            </button>

            {isVisible && (
                <div className="dropdown-container">
                    <div className="dropdown-content">
                        {Children.map(props.children, child => {
                            if (!React.isValidElement(child)) {
                                return
                            }

                            return (
                                <button
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        props.onChange(child.props.value)
                                        closeDropdown()
                                    }}
                                >
                                    {child}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dropdown;