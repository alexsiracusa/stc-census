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

    const enterInput = () => {
        if (value !== null) {
            const newValue = value > 0 ? value : ''
            setValue(newValue)
            props.setValue(newValue ? newValue : 0)
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

    const handleInputChange = (e) => {
        let inputValue = e.target.value;

        // Allow only numeric characters
        if (/^\d*$/.test(inputValue)) {
            // Remove leading zeros
            if (inputValue.startsWith("0") && inputValue.length > 1) {
                inputValue = inputValue.replace(/^0+/, "");
            }

            // Set the value, but keep zero as empty
            setValue(inputValue === "0" ? "" : inputValue);
        }
    };

    useEffect(() => {
        setValue(props.value ? props.value : '')
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