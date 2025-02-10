import './EditDependenciesButton.css'

import {useSelector} from "react-redux";
import EditDependenciesDropdown from "./EditDependenciesDropdown/EditDependenciesDropdown.tsx";
import Ellipsus from '../../../../assets/Icons/Ellipsus.svg'
import Plus from '../../../../assets/Icons/Plus.svg'
import Edit from '../../../../assets/Icons/Edit2.svg'

type TaskIconProps = {
    project_id: number,
    task_id: number,
    max_shown: number
}

const MoreTaskButton = (props: TaskIconProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);

    const icon = (() => {
        if (task.depends_on.length == 0) {
            return <img src={Plus} className='plus'/>
        }
        else if (task.depends_on.length <= props.max_shown) {
            return <img src={Edit} className='edit'/>
        }
        else {
            return <img src={Ellipsus} className='ellipsus'/>
        }
    })();

    return (
        <EditDependenciesDropdown
            className='square-button more-tasks-button'
            title='More Taks'
            task_id={props.task_id}
            project_id={props.project_id}
        >
            {icon}
        </EditDependenciesDropdown>
    )
}

export default MoreTaskButton;
