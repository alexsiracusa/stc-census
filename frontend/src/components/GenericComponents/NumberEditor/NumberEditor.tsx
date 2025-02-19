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
    const [value, setValue] = useState(props.value)
    const ref = useRef(null);

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

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            enterInput()
        }
        if (e.key === "-" || e.key === "+" || e.key === "e") {
            e.preventDefault();
        }
    };

    const handleInputChange = (e) => {
        let inputValue = e.target.value;

        if (/^[0-9]*\.?[0-9]*$/.test(inputValue)) {
            // Handle leading decimal points (e.g., ".5" -> "0.5")
            if (inputValue.startsWith(".")) {
                inputValue = "0" + inputValue;
            }

            // Remove multiple leading zeros, but allow "0" or "0.x"
            if (inputValue.startsWith("0") && inputValue[1] !== "." && inputValue.length > 1) {
                inputValue = inputValue.replace(/^0+([0-9]+)/, "$1");
            }

            // Set the sanitized value
            setValue(inputValue);
        }
    };

    useEffect(() => {
        setValue(props.value)
    }, [props.value]);

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
                onChange={handleInputChange}
            />
        </div>
    )
}

export default NumberEditor