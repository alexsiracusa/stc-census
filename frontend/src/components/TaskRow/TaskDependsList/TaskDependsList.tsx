import './TaskDependsList.css'
import TaskIcon from "./TaskIcon/TaskIcon.tsx";
import MoreTasksButton from "./MoreTasksButton/MoreTasksButton.tsx";
import AddDependencyButton from "./AddDependencyButton/AddDependencyButton.tsx";
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
                    <TaskIcon
                        key={`${depends_on.project_id}_${depends_on.task_id}`}
                        project_id={depends_on.project_id}
                        task_id={depends_on.task_id}
                    />
                )
            })}
            {task.depends_on.length <= max_shown ?
                <AddDependencyButton project_id={props.project_id} task_id={props.task_id}/> :
                <MoreTasksButton project_id={props.project_id} task_id={props.task_id}/>
            }
        </div>
    )
}

export default TaskDependsList;