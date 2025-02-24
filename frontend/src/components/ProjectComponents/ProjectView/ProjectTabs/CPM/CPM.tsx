import './CPM.css';

import { useSelector } from "react-redux";
import TabProps from "../TabProps";
import SensibleScheduleButton from "./SensibleScheduleButton/SensibleScheduleButton.tsx";
import TaskGraph from './TaskGraph/TaskGraph.tsx';
import useFetchTasks from "../../../../../hooks/useFetchTasks.ts";
import useFetchCPM from "../../../../../hooks/useFetchCPM.ts";

const CPM = (props: TabProps) => {
    const projectId = Number(props.project_id);

    const { loading: tasksLoading, error: tasksError } = useFetchTasks(projectId);
    const { loading: cpmLoading, error: cpmError } = useFetchCPM(projectId);

    const tasks = useSelector((state: any) => {
        const project = state.projects.byId[projectId];
        return (project && project.byId) ? Object.values(project.byId) : [];
    });

    const projectCpmData = useSelector((state: any) => state.projects.byId[projectId]);

    // Return early while data is loading or if there are errors.
    if (tasksLoading) {
        return <div className="cpm">Loading tasks...</div>;
    }

    if (tasksError) {
        return <div className="cpm">Error loading tasks</div>;
    }

    if (cpmLoading) {
        return <div className="cpm">Loading CPM data...</div>;
    }

    if (cpmError) {
        return <div className="cpm">Error loading CPM data</div>;
    }

    const hasCycles = projectCpmData.cycleInfo && projectCpmData.cycleInfo.length > 0;

    return (
        <div className="cpm">
            {hasCycles && (
                <div className="error-message">
                    Warning: The project contains cycles, which may affect the correctness of the CPM analysis.
                </div>
            )}
            <div className="graph-container">
                <div className="critical-path-length">
                    Critical Path Length: {projectCpmData.criticalPathLength} days
                </div>
                <TaskGraph
                    tasks={tasks}
                    currentProjectId={projectId}
                    cpmData={projectCpmData.cpm}
                    cycleInfo={projectCpmData.cycleInfo}
                />
                <div className="sensible-schedule-button">
                    <SensibleScheduleButton props={props} />
                </div>
            </div>
        </div>
    );
};

export default CPM;
