import DropdownDatePicker from "../../DropdownDatePicker/DropdownDatePicker.tsx";
import {useSelector} from "react-redux";
import {format} from "date-fns";

type TaskDatePickerProps = {
    project_id: number
    task_id: number
}


const TaskDatePicker = (props: TaskDatePickerProps) => {
    const date = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id].target_start_date);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'dd-MM-yy')
    }

    return (
        <DropdownDatePicker
            className=''
            title=''
            onChange={(value) => {
                console.log(value)
            }}>
            <div className='task-end-date'>
                <p>{formatDate(date)}</p>
            </div>
        </DropdownDatePicker>
    )
}

export default TaskDatePicker