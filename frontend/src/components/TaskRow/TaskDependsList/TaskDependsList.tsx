import './TaskDependsList.css'
import {Task} from "../../../types/Task.ts";

type TaskDependsListProps = {
    task: Task
}

const TaskDependsList = (props: TaskDependsListProps) => {
    const task = props.task

    return (
        <div className="task-depends-list">
            {task.depends_on.map((depends_on) => (
                <div className='depends-task-id' title={`${depends_on.task_id}`}>
                    <p>{depends_on.task_id}</p>
                </div>
            ))}
        </div>
    )
}

export default TaskDependsList;