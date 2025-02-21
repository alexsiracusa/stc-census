import './ProjectRow.css';
import { Link } from "react-router";
import { useSelector } from "react-redux";
import useFetchProjectSummary from "../../../hooks/useFetchProjectSummary.ts";
import ProjectStatusSelector from "./ProjectStatusSelector/ProjectStatusSelector.tsx";
import SimpleDatePicker from "../../GenericComponents/SimpleDatePicker/SimpleDatePicker.tsx";
import useUpdateProject from "../../../hooks/useUpdateProject.ts";
import ProjectTasks from "./ProjectTasks/ProjectTasks.tsx";
import DownloadProjectButton from "./DownloadProjectButton/DownloadProjectButton.tsx";

type ProjectRowProps = {
    project_id: number;
    editing: boolean;
    select: (selected: boolean) => void;
};

const ProjectRow = (props: ProjectRowProps) => {
    const { loading, error } = useFetchProjectSummary(props.project_id);
    const project = useSelector((state: any) => state.projects.byId[props.project_id]);
    const { updateProject } = useUpdateProject();

    if (error) return <p>Error: {error.toString()}</p>;
    if (loading || project === undefined) return <p>Loading</p>;

    return (
        <div className="project-row">
            {props.editing ? (
                <div className="project-id">
                    <input
                        type="checkbox"
                        onChange={(e) => {
                            props.select(e.target.checked);
                        }}
                    />
                </div>
            ) : (
                <Link reloadDocument to={`/project/${props.project_id}/task-list`} className="project-id">
                    <p>P{project.id}</p>
                </Link>
            )}

            <Link reloadDocument to={`/project/${props.project_id}/task-list`} className="project-name-container">
                <p>{project.name}</p>
            </Link>

            <div className="project-status-container">
                <ProjectStatusSelector project_id={props.project_id} />
            </div>

            <div className="project-tasks-container">
                <ProjectTasks project_id={props.project_id} />
            </div>

            <div className="project-start-date">
                <SimpleDatePicker
                    currentDate={project.target_start_date}
                    title="Edit Start Date"
                    onChange={(value) => {
                        updateProject(props.project_id, { target_start_date: value });
                    }}
                />
            </div>

            <div className="project-due-date">
                <SimpleDatePicker
                    currentDate={project.target_completion_date}
                    title="Edit Start Date"
                    onChange={(value) => {
                        updateProject(props.project_id, { target_completion_date: value });
                    }}
                />
            </div>

            <div className="project-budget">
                <p>{project.expected_cost.toLocaleString()}</p>
            </div>

            <div className="project-actual-cost">
                <p>{project.actual_cost.toLocaleString()}</p>
            </div>

            <div className={'project-budget-variance ' + (project.budget_variance < 0 ? 'negative' : 'positive')}>
                {project.budget_variance < 0 ? (
                    <p>{`(${Math.abs(project.budget_variance).toLocaleString()})`}</p>
                ) : (
                    <p>{Math.abs(project.budget_variance).toLocaleString()}</p>
                )}
            </div>
            <div className="project-download-container">
                <DownloadProjectButton projectId={props.project_id} />
            </div>
        </div>
    );
};

export default ProjectRow;
