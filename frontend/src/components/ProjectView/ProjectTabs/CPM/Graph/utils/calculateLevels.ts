import { Task } from '../../Data/Task';

export const calculateLevels = (
    tasks: Task[],
    rootTasks: Task[]
): Map<number, number> => {
    const levels = new Map<number, number>();

    const calculateLevel = (taskId: number, level: number = 0) => {
        if (levels.has(taskId)) {
            levels.set(taskId, Math.max(levels.get(taskId)!, level));
        } else {
            levels.set(taskId, level);
        }

        const dependents = tasks.filter(t => t.depends_on.includes(taskId));
        dependents.forEach(dep => {
            calculateLevel(dep.id, level + 1);
        });
    };

    rootTasks.forEach(task => calculateLevel(task.id));

    return levels;
};
