import './TaskDependsList.css'
import TaskIcon from "./TaskIcon.tsx";
import AddDependencyButton from "./AddDependencyButton.tsx";
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
                        depends_on={depends_on.task_id}
                        depends_on_project={depends_on.project_id}
                    />
                )
            })}
            <AddDependencyButton project_id={props.project_id} task_id={props.task_id}/>
        </div>
    )
}

export default TaskDependsList;