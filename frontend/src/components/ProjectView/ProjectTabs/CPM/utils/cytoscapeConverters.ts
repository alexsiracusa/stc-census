// utils/cytoscapeConverters.ts
import { Task, TaskNode, TaskEdge } from './types';

export const convertTasksToNodes = (tasks: Task[]): TaskNode[] => {
    return tasks.map(task => ({
        id: String(task.id),
        label: task.name,
        status: task.status
    }));
};

export const convertTasksToEdges = (tasks: Task[]): TaskEdge[] => {
    return tasks.flatMap(task => {
        const dependencies = task.depends_on || [];
        return dependencies.map(dependencyId => ({
            source: String(dependencyId),
            target: String(task.id)
        }));
    });
};
