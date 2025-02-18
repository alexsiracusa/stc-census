import React, {useRef, useState, useEffect} from "react";
import "./AutoExpandingTextarea.css";

type AutoExpandingTextareaProps = {
    value: string
    onChange: (value: string) => void,
    onFocus?: (e) => void
    placeholder?: string
    className?: string
}

const AutoExpandingTextarea = (props: AutoExpandingTextareaProps) => {
    const textareaRef = useRef(null);
    const [textareaHeight, setTextareaHeight] = useState("auto");

    useEffect(() => {
        // Automatically adjust the height when the value changes
        resizeTextarea();
    }, [props.value]);

    const resizeTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on content
        }
    };

    const handleInputChange = (e) => {
        props.onChange(e.target.value); // Update the value from parent
        resizeTextarea();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault(); // Prevent default tab behavior (focus change)

            // Find the current cursor position
            const {selectionStart, selectionEnd} = textareaRef.current;

            // Insert a tab character at the cursor position
            const newValue =
                props.value.substring(0, selectionStart) +
                "\t" +
                props.value.substring(selectionEnd);

            // Update the text value
            props.onChange(newValue);

            // Manually move the cursor after the inserted tab
            setTimeout(() => {
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
                    selectionStart + 1;
            }, 0);
        }
    };

    return (
        <textarea
            ref={textareaRef}
            value={props.value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={props.onFocus}
            placeholder={props.placeholder || "Type here..."}
            style={{height: textareaHeight, overflow: "hidden"}}
            className={"auto-expanding-textarea " + props.className}
        />
    );
};

export default AutoExpandingTextarea;