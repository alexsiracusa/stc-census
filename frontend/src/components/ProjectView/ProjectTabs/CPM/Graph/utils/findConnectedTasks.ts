import { Task } from '../../Data/Task';

export const findConnectedTasks = (
    taskId: number,
    visited: Set<number>,
    tasks: Task[]
): Set<number> => {
    visited.add(taskId);
    const task = tasks.find(t => t.id === taskId)!;

    // Check dependencies
    task.depends_on.forEach(depId => {
        if (!visited.has(depId)) {
            findConnectedTasks(depId, visited, tasks);
        }
    });

    // Check tasks that depend on this task
    tasks.forEach(t => {
        if (t.depends_on.includes(taskId) && !visited.has(t.id)) {
            findConnectedTasks(t.id, visited, tasks);
        }
    });

    return visited;
};
