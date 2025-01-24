import {Task} from '../../Data/Task';
import {GROUP_VERTICAL_SPACING, NODE_HORIZONTAL_SPACING, NODE_VERTICAL_SPACING} from './constants';

export const calculatePositions = (
    tasks: Task[],
    taskGroups: number[][],
    levels: Map<number, number>
): Map<number, { x: number; y: number }> => {
    const positions = new Map<number, { x: number; y: number }>();
    let currentGroupOffset = 0;

    taskGroups.forEach(group => {
        const levelGroups = new Map<number, number[]>();

        // Group tasks by level
        group.forEach(taskId => {
            const level = levels.get(taskId) || 0;

            if (!levelGroups.has(level)) {
                levelGroups.set(level, []);
            }
            levelGroups.get(level)!.push(taskId);
        });

        // Calculate positions for this group
        levelGroups.forEach((taskIds, level) => {
            taskIds.forEach((taskId, index) => {
                const task = tasks.find(t => t.id === taskId)!;
                let yPos = currentGroupOffset + index * NODE_VERTICAL_SPACING;

                if (task.depends_on.length > 1) {
                    const dependencyPositions = task.depends_on
                        .filter(depId => group.includes(depId))
                        .map(depId => positions.get(depId)?.y)
                        .filter(y => y !== undefined) as number[];

                    if (dependencyPositions.length > 0) {
                        yPos = dependencyPositions.reduce((a, b) => a + b, 0) / dependencyPositions.length;
                    }
                }

                positions.set(taskId, {
                    x: level * NODE_HORIZONTAL_SPACING,
                    y: yPos
                });
            });
        });

        // Calculate the height of this group and add spacing for the next group
        const groupPositions = Array.from(positions.entries())
            .filter(([taskId]) => group.includes(taskId))
            .map(([, pos]) => pos.y);
        const groupHeight = Math.max(...groupPositions) - Math.min(...groupPositions);
        currentGroupOffset += groupHeight + GROUP_VERTICAL_SPACING;
    });

    return positions;
};
