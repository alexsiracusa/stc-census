import { Task } from '../../Data/Task';
import { findConnectedTasks } from './findConnectedTasks';

export const findTaskGroups = (tasks: Task[]): number[][] => {
    const groups: number[][] = [];
    const allVisited = new Set<number>();

    tasks.forEach(task => {
        if (!allVisited.has(task.id)) {
            const groupTasks = Array.from(
                findConnectedTasks(task.id, new Set<number>(), tasks)
            );
            groups.push(groupTasks);
            groupTasks.forEach(id => allVisited.add(id));
        }
    });

    return groups;
};
