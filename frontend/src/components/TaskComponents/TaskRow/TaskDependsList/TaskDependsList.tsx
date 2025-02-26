import './TaskDependsList.css'
import TaskIcon from "../../TaskIcon/TaskIcon.tsx";
import TaskPopup from "../../TaskPopup/TaskPopup.tsx";
import EditDependenciesButton from "./EditDependenciesButton/EditDependenciesButton.tsx";
import {useSelector} from "react-redux";

type TaskDependsListProps = {
    project_id: number
    task_id: number
}

const TaskDependsList = (props: TaskDependsListProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);
    const max_shown = 3

    if (task == null || task.depends_on == null) {
        return <></>
    }

    return (
        <div className="task-depends-list">
            {task.depends_on.slice(0, max_shown).map((depends_on) => {
                return (
                    <TaskPopup
                        project_id={depends_on.project_id}
                        task_id={depends_on.task_id}
                        buttonClassName='icon-container'
                        key={`${depends_on.project_id}_${depends_on.task_id}`}
                    >
                        <TaskIcon
                            project_id={depends_on.project_id}
                            task_id={depends_on.task_id}
                            clickable={true}
                        />
                    </TaskPopup>
                )
            })}
            <EditDependenciesButton project_id={props.project_id} task_id={props.task_id} max_shown={max_shown}/>
        </div>
    )
}

export default TaskDependsList;