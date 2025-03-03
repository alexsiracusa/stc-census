import './CPMComponent.css';

import { useSelector } from "react-redux";
import SensibleScheduleButton from "./SensibleScheduleButton/SensibleScheduleButton.tsx";
import CPMGraph from './CPMGraph/CPMGraph.tsx';
import useFetchProjectTasks from "../../../../../../hooks/useFetchProjectTasks.ts";
import useFetchCPM from "../../../../../../hooks/useFetchCPM.ts";

interface CPMComponentProps {
    project_id: string;
    [key: string]: any; // For any additional props
}

const CPMComponent = (props: CPMComponentProps) => {
    const projectId = Number(props.project_id);

    const { loading: tasksLoading, error: tasksError } = useFetchProjectTasks(projectId);
    const { loading: cpmLoading, error: cpmError } = useFetchCPM(projectId);

    const projectCpmData = useSelector((state: any) => state.projects.byId[projectId]);

    // Return early while data is loading or if there are errors.
    if (tasksLoading) {
        return <div className="cpm-component">Loading tasks...</div>;
    }

    if (tasksError) {
        return <div className="cpm-component">Error loading tasks</div>;
    }

    if (cpmLoading) {
        return <div className="cpm-component">Loading CPM data...</div>;
    }

    if (cpmError) {
        // with error message
        return <div className="cpm-component">Error loading CPM data
            <div className="error-message">{cpmError.toString()}</div>
        </div>;
    }

    const cycleInfo = projectCpmData.cycle_info;
    const criticalPathLength = projectCpmData.critical_path_length;

    const hasCycles = cycleInfo && cycleInfo.length > 0;

    return (
        <div className="cpm-component">
            {hasCycles && (
                <div className="error-message">
                    Warning: The project contains cycles, which may affect the correctness of the CPM analysis.
                </div>
            )}
            <div className="graph-container">
                <div className="critical-path-length">
                    Critical Path Length: {criticalPathLength} days
                </div>
                <CPMGraph
                    currentProjectId={projectId}
                    cpmData={projectCpmData.cpm}
                    cycleInfo={cycleInfo}
                />
                <div className="sensible-schedule-button">
                    <SensibleScheduleButton props={props} />
                </div>
            </div>
        </div>
    );
};

export default CPMComponent;
