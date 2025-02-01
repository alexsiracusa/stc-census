import TabProps from "../TabProps";
import TaskGraph from './TaskGraph/TaskGraph.tsx';
import {Task} from "../../../../types/task.ts";
import {useEffect, useState} from "react";

export const useTasksFetcher = (projectId: string): Task[] => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const host = import.meta.env.VITE_BACKEND_HOST;

    useEffect(() => {
        fetch(`${host}/project/${projectId}/all-tasks`)
            .then(response => response.json())
            .then(json => {
                setTasks(json);
            })
            .catch(error => console.error(error));
    }, [projectId, host]);

    return tasks;
};

const CPM = (props: TabProps) => {
    // Load task data
    const tasks: Task[] = useTasksFetcher(props.project['id']);

    // Add loading state
    if (!tasks || tasks.length === 0) {
        return <div className="cpm">Loading tasks...</div>;
    }

    return (
        <TaskGraph
            className='cpm'
            tasks={tasks}
        />
    );
};

export default CPM;
