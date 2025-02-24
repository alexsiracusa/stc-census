import TabProps from "../TabProps";
import TaskGraph from './TaskGraph/TaskGraph.tsx';

import {useEffect, useState} from "react";
import './CPM.css';
import SensibleScheduleButton from "./SensibleScheduleButton/SensibleScheduleButton.tsx";
import useFetchTasks from "../../../../../hooks/useFetchTasks.ts";
import {useSelector} from "react-redux";

const useFetchCpmData = (projectId: number): [any, boolean] => {
    const [cpmData, setCpmData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const host = import.meta.env.VITE_BACKEND_HOST;

    useEffect(() => {
        setLoading(true);
        fetch(`${host}/project/${projectId}/cpm`)
            .then(response => response.json())
            .then(json => {
                setCpmData(json);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, [projectId, host]);

    return [cpmData, loading];
}

const CPM = (props: TabProps) => {
    const projectId = Number(props.project_id);
    const { loading, error } = useFetchTasks(projectId);

    const tasks = useSelector((state: any) => Object.values(state.projects.byId[projectId].byId));
    const [cpmData, cpmLoading] = useFetchCpmData(projectId);

    if (loading) {
        return <div className="cpm">Loading tasks...</div>;
    }

    if (error) return <div>Error loading tasks</div>;


    if (cpmLoading) {
        return <div className="cpm">Loading CPM data...</div>;
    }

    const hasCycles = cpmData.cycleInfo && cpmData.cycleInfo.length > 0;

    return (
        <div className="cpm">
            {hasCycles && (
                <div className="error-message">
                    Warning: The project contains cycles, which may affect the correctness of the CPM analysis.
                </div>
            )}
            <div className="graph-container">
                <div className="critical-path-length">
                    Critical Path Length: {cpmData.criticalPathLength} days
                </div>
                <TaskGraph
                    tasks={tasks}
                    currentProjectId={projectId}
                    cpmData={cpmData.cpm}
                    cycleInfo={cpmData.cycleInfo}
                />
                <div className="sensible-schedule-button">
                    <SensibleScheduleButton props={props}/>
                </div>
            </div>
        </div>
    );

};


export default CPM;