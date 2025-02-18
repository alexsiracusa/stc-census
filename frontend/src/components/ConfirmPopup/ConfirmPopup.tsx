import './ConfirmPopup.css'

import React, {Children, PropsWithChildren, useState} from "react";
import Popup from "../Popup/Popup.tsx";

type ConfirmPopupProps = {
    className: string,
    message: string
    left: {
        text: string,
        onPress: () => void,
        type: 'neutral' | 'destructive'
    }
    right: {
        text: string,
        onPress: () => void,
        type: 'neutral' | 'destructive'
    }
}

const ConfirmPopup = (props: PropsWithChildren<ConfirmPopupProps>) => {
    const [isVisible, setIsVisible] = useState(false);

     const icon = <>{
        Children.map(props.children, child => {
            return child
        })
    }</>

    return (
        <Popup
            icon={icon}
            buttonClassName={props.className}
            contentClassName='confirm-button-content'
            title='Delete Task'
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            transparentBackground={true}
        >
            <p>{props.message}</p>

            <div className='action-items'>
                <button
                    className={props.left.type}
                    onClick={() => {
                        setIsVisible(false)
                        props.left.onPress()
                    }}
                >
                    <p>{props.left.text}</p>
                </button>

                <button
                    className={props.right.type}
                    onClick={() => {
                        setIsVisible(false)
                        props.right.onPress()
                    }}
                >
                    <p>{props.right.text}</p>
                </button>
            </div>
        </Popup>
    )
}

export default ConfirmPopup