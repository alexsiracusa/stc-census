import TabProps from "../TabProps";
import TaskGraph from './TaskGraph/TaskGraph.tsx';
import {Task} from "../../../../types/Task.ts";
import {useEffect, useState} from "react";
import useCpmData from "../../../../hooks/useCpmData.ts";

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

const CPM = (props: TabProps) => {
    const projectId = Number(props.project_id);
    const [tasks, loading] = useTasksFetcher(`${projectId}`);
    const cpmData = useCpmData(projectId);

    if (loading) {
        return <div className="cpm">Loading tasks...</div>;
    }

    return (
        <TaskGraph
            className='cpm'
            tasks={tasks}
            currentProjectId={projectId}
            cpmData={cpmData}
        />
    );
};

export default CPM;