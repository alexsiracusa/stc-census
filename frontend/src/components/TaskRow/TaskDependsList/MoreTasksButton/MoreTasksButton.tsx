import './MoreTasksButton.css'

import {useSelector} from "react-redux";
import MoreTasksDropdown from "./MoreTasksDropdown/MoreTasksDropdown.tsx";
import Ellipsus from '../../../../assets/Icons/Ellipsus.svg'

type TaskIconProps = {
    project_id: number,
    task_id: number
}

const TaskIcon = (props: TaskIconProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);

    return (
        <MoreTasksDropdown
            className='square-button more-tasks-button'
            title='More Taks'
            task_id={props.task_id}
            project_id={props.project_id}
        >
            <img src={Ellipsus}/>
        </MoreTasksDropdown>
    )
}

export default TaskIcon;
