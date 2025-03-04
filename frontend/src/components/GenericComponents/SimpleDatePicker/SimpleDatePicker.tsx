import './SimpleDatePicker.css'

import DropdownDatePicker from "../Dropdowns/DropdownDatePicker/DropdownDatePicker.tsx";
import {format} from "date-fns";

type SimpleDatePickerProps = {
    currentDate: string | null
    title: string
    onChange: (arg0: any) => void
    disableWeekends?: boolean
}

const SimpleDatePicker = (props: SimpleDatePickerProps) => {
    const date = props.currentDate ? new Date(props.currentDate) : null

    return (
        <DropdownDatePicker
            className='simple-date-picker'
            title={props.title}
            currentDate={date}
            onChange={props.onChange}
            disableWeekends={props.disableWeekends}
        >
            {date ? <p>{format(date, 'dd-MM-yy')}</p> : <p></p>}
        </DropdownDatePicker>
    )
}

export default SimpleDatePicker