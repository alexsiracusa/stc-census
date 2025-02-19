import './ProjectTasks.css'
import {useSelector} from "react-redux";
import {TaskStatuses, TaskStatusInfo} from "../../../../types/TaskStatuses.ts";

type ProjectRowProps = {
    project_id: number
}

const ProjectTasks = (props: ProjectRowProps) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);

    return (
        <div className='project-tasks'>
            {TaskStatuses.map((status) => (
                <div
                    className='task-icon'
                    title={`Tasks ${TaskStatusInfo[status].name}`}
                    key={status}
                    style={{
                        backgroundColor: TaskStatusInfo[status].color + '45',
                        color: TaskStatusInfo[status].color
                    }}
                >
                    <p>{project.status_counts[status]}</p>
                </div>
            ))}
        </div>
    )
}

export default ProjectTasks