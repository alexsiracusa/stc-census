import './NameEditor.css'

import {useEffect, useRef, useState} from "react";

type NameEditorProps = {
    name: string,
    setName: (string) => void
    className?: string
    placeholder?: string
}

const NameEditor = (props: NameEditorProps) => {
    const [name, setName] = useState(props.name)
    const ref = useRef(null);

    const enterInput = () => {
        if (name !== "") {
            setName(name)
            props.setName(name)
        } else {
            setName(props.name)
        }
        ref.current.blur()
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            enterInput()
        }
    };

    useEffect(() => {
        setName(props.name)
    }, [props.name]);

    return (
        <div className={`name-editor ${props.className ? props.className : ''}`}>
            <input
                ref={ref}
                type="text"
                placeholder={props.placeholder ? props.placeholder : "Must give a name"}
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={enterInput}
            />
        </div>
    )
}

export default NameEditor