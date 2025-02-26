import './TaskPersonInChargePicker.css'

import {useSelector} from "react-redux";
import useFetchAccounts from "../../../hooks/useFetchAccounts.ts";
import DropdownPicker from "../../GenericComponents/Dropdowns/DropdownPicker/DropdownPicker.tsx";
import {useState} from "react";
import useUpdateTask from "../../../hooks/useUpdateTask.ts";

type TaskPersonInChargePickerProps = {
    project_id: number
    task_id: number
}

const TaskPersonInChargePicker = (props: TaskPersonInChargePickerProps) => {
    const {accountsLoading, accountsError} = useFetchAccounts();

    const [isVisible, setIsVisible] = useState(false)
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const {updateTask, loading, error, data} = useUpdateTask();
    const accounts = useSelector((state) => state.accounts.byId);

    const select = (account) => {
        updateTask(task.project_id, task.id, {
            person_in_charge: account ? account : null,
            person_in_charge_id: account ? Number(account.id) : null
        })
        setIsVisible(false)
    }

    function capitalize(word: string): string {
        if (!word) return '';
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }

    return (
        <DropdownPicker
            icon={
                task.person_in_charge === null ? (
                    <p></p>
                ) : (
                    <p>{`${capitalize(task.person_in_charge.first_name)}`}</p>
                )
            }
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
                <>
                    <button
                        className='task-person-in-charge-picker-row'
                        onClick={() => select(null)}
                    >
                        <p>Unassign</p>
                    </button>

                    {Object.values(accounts).map((account) => (
                        <button
                            key={account.id}
                            className='task-person-in-charge-picker-row'
                            onClick={() => select(account)}
                        >
                            <p>{capitalize(account.first_name)} {capitalize(account.last_name)}</p>
                        </button>
                    ))}
                </>
            )}
        </DropdownPicker>
    )
}

export default TaskPersonInChargePicker