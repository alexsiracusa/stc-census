import './StatusSelector.css'

import DropdownRowPicker from "../Dropdowns/DropdownRowPicker/DropdownRowPicker.tsx";
import DropdownPickerOption from "../Dropdowns/DropdownPicker/DropdownPickerOption.tsx";
import {useEffect, useState} from "react";

type StatusInfo = {
    value: string,
    displayName: string
    color: string
};

type StatusSelectorProps = {
    value: StatusInfo,
    options: [StatusInfo]
    onChange: (StatusInfo) => void
}

const StatusSelector = (props: StatusSelectorProps) => {
    const [selected, setSelected] = useState(props.value)

    const handleUpdate = (value) => {
        setSelected(props.options.find((status) => status.value === value))
        props.onChange(value)
    };

    useEffect(() => {
        setSelected(props.value)
    }, [props.value]);

    return (
        <div className="status-selector">
            <DropdownRowPicker
                icon={
                    <div
                        className="dropdown-icon-inner"
                        style={{
                            backgroundColor: selected.color + '45',
                            color: selected.color
                        }}
                    >
                        <p>{selected.displayName}</p>
                    </div>
                }
                className="dropdown-icon"
                title="Edit Status"
                onChange={handleUpdate}
            >
                {props.options.map((status) => (
                    <DropdownPickerOption
                        value={status.value}
                        className="status"
                        key={status.value}
                    >
                        <div
                            className="status-inner"
                            style={{
                                backgroundColor: status.color + '45',
                                color: status.color
                            }}
                        >
                            {`${status.displayName}`}
                        </div>
                    </DropdownPickerOption>
                ))}
            </DropdownRowPicker>
        </div>
    )
};

export default StatusSelector;