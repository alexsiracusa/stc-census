import './NumberEditor.css'
import {useRef, useState} from "react";

type NumberEditorProps = {
    value: number,
    setValue: (number) => void
    title?: string
}

const NumberEditor = (props: NumberEditorProps) => {
    const [value, setValue] = useState(props.value ? props.value : '')
    const ref = useRef(null);

    const enterInput = () => {
        if (value !== null) {
            setValue(value)
            props.setValue(value)
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