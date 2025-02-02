import './TaskDependsList.css'
import {Task} from "../../../types/Task.ts";
import {TaskStatusInfo} from "../../../types/TaskStatuses.ts";
import TaskIcon from "./TaskIcon.tsx";

type TaskDependsListProps = {
    task: Task
}

const TaskDependsList = (props: TaskDependsListProps) => {
    const task = props.task

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
        </div>
    )
}

export default TaskDependsList;