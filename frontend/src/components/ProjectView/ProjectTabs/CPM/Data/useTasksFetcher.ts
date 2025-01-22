import { useState, useEffect } from 'react';
import { Task } from './Task.tsx';

interface UseTasksFetcherReturn {
    tasks: Task[];
}

export const useTasksFetcher = (projectId: string): UseTasksFetcherReturn => {
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

    return { tasks };
};
