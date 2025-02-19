import './NumberEditor.css'
import {useEffect, useRef, useState} from "react";

type NumberEditorProps = {
    value: number,
    setValue: (number) => void
    title?: string
    negative?: boolean
    step?: number
}

const NumberEditor = (props: NumberEditorProps) => {
    const [value, setValue] = useState(props.value ? props.value : '')
    const ref = useRef(null);

    // hide Up/Down arrows in Firefox
    useEffect(() => {
        const inputElement = ref.current;

        if (!inputElement) return;

        // Function to handle mouseenter (show spinner)
        const handleMouseEnter = () => {
            inputElement.style.appearance = 'number'; // Show spinner
            inputElement.style.MozAppearance = 'number'; // Firefox support
        };

        // Function to handle mouseleave (hide spinner)
        const handleMouseLeave = () => {
            inputElement.style.appearance = 'textfield'; // Hide spinner
            inputElement.style.MozAppearance = 'textfield'; // Firefox support
        };

        // Attach event listeners for hover effects
        inputElement.addEventListener('mouseenter', handleMouseEnter);
        inputElement.addEventListener('mouseleave', handleMouseLeave);

        // Cleanup event listeners when component unmounts
        return () => {
            inputElement.removeEventListener('mouseenter', handleMouseEnter);
            inputElement.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const enterInput = () => {
        if (value !== null) {
            const newValue = value > 0 ? value : 0
            setValue(newValue)
            props.setValue(newValue)
        } else {
            setValue(props.value)
        }
        ref.current.blur()
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            enterInput()
        }
    };

    return (
        <div className='number-editor'>
            <input
                ref={ref}
                type="number"
                value={value}
                min={props.negative ? '' : 0}
                step={props.step ? props.step : 1}
                title={props.title ? props.title : ''}
                onKeyDown={handleKeyDown}
                onBlur={enterInput}
                onChange={(e) => {
                    setValue(Number(e.target.value))
                }}
            />
        </div>
    )
}

export default NumberEditor