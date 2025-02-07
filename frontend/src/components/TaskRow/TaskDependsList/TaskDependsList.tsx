import './TaskDependsList.css'
import TaskIcon from "./TaskIcon/TaskIcon.tsx";
import AddDependencyButton from "./AddDependencyButton/AddDependencyButton.tsx";
import {useSelector} from "react-redux";

type TaskDependsListProps = {
    project_id: number
    task_id: number
}

const TaskDependsList = (props: TaskDependsListProps) => {
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);

    if (task == null || task.depends_on == null) {
        return <></>
    }

    return (
        <div className="task-depends-list">
            {task.depends_on.map((depends_on) => {
                return (
                    <TaskIcon
                        key={`${depends_on.project_id}_${depends_on.task_id}`}
                        project_id={depends_on.project_id}
                        task_id={depends_on.task_id}
                    />
                )
            })}
            <AddDependencyButton project_id={props.project_id} task_id={props.task_id}/>
        </div>
    )
}

export default TaskDependsList;