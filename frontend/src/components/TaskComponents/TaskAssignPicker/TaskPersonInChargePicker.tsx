import './TaskPersonInChargePicker.css'

import DropdownRowPicker from "../../GenericComponents/Dropdowns/DropdownRowPicker/DropdownRowPicker.tsx";
import DropdownPickerOption from "../../GenericComponents/Dropdowns/DropdownPicker/DropdownPickerOption.tsx";
import {useSelector} from "react-redux";
import useFetchAccounts from "../../../hooks/useFetchAccounts.ts";

type TaskPersonInChargePickerProps = {
    project_id: number
    task_id: number
}

const TaskPersonInChargePicker = (props: TaskPersonInChargePickerProps) => {
    const {loading, error} = useFetchAccounts();
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const accounts = useSelector((state) => state.accounts.byId);

    return (
        <DropdownRowPicker
            icon={(
                <div className=''>
                    Assign
                </div>
            )}
            className='task-person-in-charge-picker'
            title=''
            onChange={(value) => {

            }}
        >
            {Object.keys(accounts).length === 0 ? (
                <div>Loading</div>
            ) : (
                <>
                    {Object.values(accounts).map((account) => (
                        <DropdownPickerOption
                            key={account.id}
                            value={account.id}
                            className='task-person-in-charge-picker-row'
                        >
                            {account.first_name}
                        </DropdownPickerOption>
                    ))}
                </>
            )}
        </DropdownRowPicker>
    )
}

export default TaskPersonInChargePicker