import './EditDependenciesButton.css'

import {useSelector} from "react-redux";
import MoreTasksDropdown from "./EditDependenciesDropdown/EditDependenciesDropdown.tsx";
import Ellipsus from '../../../../assets/Icons/Ellipsus.svg'
import Plus from '../../../../assets/Icons/Plus.svg'

type TaskIconProps = {
    project_id: number,
    task_id: number,
    max_shown: number
}

const MoreTaskButton = (props: TaskIconProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);

    return (
        <MoreTasksDropdown
            className='square-button more-tasks-button'
            title='More Taks'
            task_id={props.task_id}
            project_id={props.project_id}
        >
            {task.depends_on.length > props.max_shown ?
                <img src={Ellipsus} className='ellipsus'/> :
                <img src={Plus} className='plus'/>
            }
        </MoreTasksDropdown>
    )
}

export default MoreTaskButton;
