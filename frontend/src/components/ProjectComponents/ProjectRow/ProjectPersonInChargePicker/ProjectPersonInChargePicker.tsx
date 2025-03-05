import './ProjectPersonInChargePicker.css'

import {useSelector} from "react-redux";
import useFetchAccounts from "../../../../hooks/useFetchAccounts.ts";
import DropdownPicker from "../../../GenericComponents/Dropdowns/DropdownPicker/DropdownPicker.tsx";
import {useState} from "react";
import useUpdateProject from "../../../../hooks/useUpdateProject.ts";

type ProjectPersonInChargePickerProps = {
    project_id: number
}

const ProjectPersonInChargePicker = (props: ProjectPersonInChargePickerProps) => {
    const {accountsLoading, accountsError} = useFetchAccounts();

    const [isVisible, setIsVisible] = useState(false)
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const {updateProject, loading, error, data} = useUpdateProject();
    const accounts = useSelector((state) => state.accounts.byId);

    const select = (account) => {
        updateProject(project.id, {
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
                project.person_in_charge === null ? (
                    <p>{'-'}</p>
                ) : (
                    <p>{`${capitalize(project.person_in_charge.first_name)}`}</p>
                )
            }
            buttonClassName='project-person-in-charge-picker'
            contentClassName='project-person-in-charge-picker-content'
            containerAlignment='left'
            contentAlignment='left'
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            title={project.person_in_charge ?
                capitalize(project.person_in_charge.first_name) + ' ' +
                capitalize(project.person_in_charge.last_name)
                : 'Select person in charge'}
        >
            {Object.keys(accounts).length === 0 ? (
                <div>Loading</div>
            ) : (
                <>
                    <button
                        className='project-person-in-charge-picker-row'
                        onClick={() => select(null)}
                    >
                        <p>Unassign</p>
                    </button>

                    {Object.values(accounts).map((account) => (
                        <button
                            key={account.id}
                            className='project-person-in-charge-picker-row'
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

export default ProjectPersonInChargePicker