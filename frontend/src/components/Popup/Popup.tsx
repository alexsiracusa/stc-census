import './Popup.css'
import React, {Children, PropsWithChildren} from "react";

type PopupProps = {
    icon: React.Element
    buttonClassName: string
    contentClassName: string
    title: string
    isVisible: boolean
    setIsVisible: (boolean) => void
}

const Popup = (props: PropsWithChildren<PopupProps>) => {
    return (
        <div className='popup'>
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
                    className='popup-background'
                    onClick={(event) => {
                        event.stopPropagation()
                        props.setIsVisible(false)
                    }}
                >
                    <div
                        className={props.contentClassName}
                        onClick={(event) => {
                            event.stopPropagation()
                        }}
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

export default Popup