import './TaskDatePicker.css'

import DropdownDatePicker from "../../DropdownDatePicker/DropdownDatePicker.tsx";
import {format} from "date-fns";

type TaskDatePickerProps = {
    currentDate: string
    title: string
    onChange: (arg0: any) => void
}

const TaskDatePicker = (props: TaskDatePickerProps) => {
    const date = new Date(props.currentDate)

    return (
        <DropdownDatePicker
            className='task-date-picker'
            title={props.title}
            currentDate={date}
            onChange={props.onChange}
        >
            <p>{format(date, 'dd-MM-yy')}</p>
        </DropdownDatePicker>
    )
}

export default TaskDatePicker