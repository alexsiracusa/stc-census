import './TaskDatePicker.css'

import DropdownDatePicker from "../../Dropdowns/DropdownDatePicker/DropdownDatePicker.tsx";
import {format} from "date-fns";

type TaskDatePickerProps = {
    currentDate: string | null
    title: string
    onChange: (arg0: any) => void
}

const TaskDatePicker = (props: TaskDatePickerProps) => {
    const date = props.currentDate ? new Date(props.currentDate) : null

    return (
        <DropdownDatePicker
            className='task-date-picker'
            title={props.title}
            currentDate={date}
            onChange={props.onChange}
        >
            {date ? <p>{format(date, 'dd-MM-yy')}</p> : <p>{'--'}</p>}
        </DropdownDatePicker>
    )
}

export default TaskDatePicker