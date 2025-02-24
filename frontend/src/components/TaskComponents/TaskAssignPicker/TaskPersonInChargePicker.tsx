import './TaskPersonInChargePicker.css'

import {useSelector} from "react-redux";
import useFetchAccounts from "../../../hooks/useFetchAccounts.ts";
import DropdownPicker from "../../GenericComponents/Dropdowns/DropdownPicker/DropdownPicker.tsx";
import {useState} from "react";

type TaskPersonInChargePickerProps = {
    project_id: number
    task_id: number
}

const TaskPersonInChargePicker = (props: TaskPersonInChargePickerProps) => {
    const [isVisible, setIsVisible] = useState(false)
    const {loading, error} = useFetchAccounts();
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const accounts = useSelector((state) => state.accounts.byId);

    function capitalize(word: string): string {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    return (
        <DropdownPicker
            icon={(
                <p>Assign</p>
            )}
            buttonClassName='task-person-in-charge-picker'
            contentClassName='task-person-in-charge-picker-content'
            containerAlignment='left'
            contentAlignment='left'
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            title=''
        >
            {Object.keys(accounts).length === 0 ? (
                <div>Loading</div>
            ) : (
                Object.values(accounts).map((account) => (
                    <button
                        key={account.id}
                        className='task-person-in-charge-picker-row'
                    >
                        <p>{capitalize(account.first_name)} {capitalize(account.last_name)}</p>
                    </button>
                ))
            )}
        </DropdownPicker>
    )
}

export default TaskPersonInChargePicker