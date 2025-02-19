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
                onChange={(e) => {
                    setValue(Number(e.target.value))
                }}
            />
        </div>
    )
}

export default NumberEditor