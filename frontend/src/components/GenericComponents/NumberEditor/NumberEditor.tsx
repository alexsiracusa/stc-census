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
    const [value, setValue] = useState<string>(props.value.toLocaleString('en-US'))
    const ref = useRef(null);

    const enterInput = () => {
        const numValue = Number(value)

        if (value !== '') {
            const newValue = numValue > 0 ? numValue : 0
            setValue(newValue.toLocaleString('en-US'))
            props.setValue(newValue)
        } else {
            setValue(props.value.toLocaleString('en-US'))
        }
        ref.current.blur()
    }

    const onFocus = () => {
        setValue(value.replace(/,/g, ''))
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
        setValue(props.value.toLocaleString('en-US'))
    }, [props.value]);

    return (
        <div className='number-editor'>
            <input
                ref={ref}
                type="text"
                value={value}
                min={props.negative ? '' : 0}
                step={props.step ? props.step : 1}
                title={props.title ? props.title : ''}
                onKeyDown={handleKeyDown}
                onBlur={enterInput}
                onFocus={onFocus}
                onChange={handleInputChange}
            />
        </div>
    )
}

export default NumberEditor