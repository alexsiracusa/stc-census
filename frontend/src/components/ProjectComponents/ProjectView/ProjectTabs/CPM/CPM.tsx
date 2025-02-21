import TabProps from "../TabProps";
import TaskGraph from './TaskGraph/TaskGraph.tsx';
import {Task} from "../../../../../types/Task.ts";
import {useEffect, useState} from "react";
import './CPM.css';
import SensibleScheduleButton from "./SensibleScheduleButton.tsx";

export const useTasksFetcher = (projectId: string): [Task[], boolean] => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const host = import.meta.env.VITE_BACKEND_HOST;

    useEffect(() => {
        setLoading(true);
        fetch(`${host}/project/${projectId}/all-tasks`)
            .then(response => response.json())
            .then(json => {
                setTasks(json);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, [projectId, host]);

    return [tasks, loading];
};

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
    const [tasks, loading] = useTasksFetcher(`${projectId}`);
    const [cpmData, cpmLoading] = useFetchCpmData(projectId);

    if (loading) {
        return <div className="cpm">Loading tasks...</div>;
    }

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
            <div>
                Critical Path Length: {cpmData.criticalPathLength} days
            </div>
            <div className="graph-container">
                <TaskGraph
                    tasks={tasks}
                    currentProjectId={projectId}
                    cpmData={cpmData.cpm}
                    cycleInfo={cpmData.cycleInfo}
                />
            </div>
            <div className={"sensible-schedule-button"}>
                <SensibleScheduleButton props={props}/>
            </div>
        </div>
    );

};


export default CPM;