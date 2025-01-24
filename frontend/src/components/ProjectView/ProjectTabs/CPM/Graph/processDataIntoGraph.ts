import { useEffect } from 'react';
import { Node, Edge, useNodesState, useEdgesState } from '@xyflow/react';
import { Task } from '../Data/Task';

import { UseGraphProcessorReturn } from './types';
import { findTaskGroups } from './utils/findTaskGroups';
import { calculateLevels } from './utils/calculateLevels';
import { calculatePositions } from './utils/calculatePositions';

export const useGraphProcessor = (tasks: Task[]): UseGraphProcessorReturn => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (tasks.length > 0) {
            processTasksIntoGraph(tasks);
        }
    }, [tasks]);

    const processTasksIntoGraph = (tasks: Task[]) => {
        // Find separate groups of connected tasks
        const taskGroups = findTaskGroups(tasks);

        // Find root tasks for each group
        const rootTasks = taskGroups.map(group =>
            tasks.filter(task =>
                group.includes(task.id) &&
                (task.depends_on.length === 0 ||
                    !task.depends_on.some(depId => group.includes(depId)))
            )
        ).flat();

        // Calculate levels for tasks
        const levels = calculateLevels(tasks, rootTasks);

        // Calculate node positions
        const positions = calculatePositions(tasks, taskGroups, levels);

        // Create nodes with calculated positions
        const newNodes = tasks.map((task) => ({
            id: `node-${task.id}`,
            type: 'task',
            position: positions.get(task.id) || { x: 0, y: 0 },
            data: task,
            className: 'cpm-node'
        }));

        // Create edges
        const newEdges = tasks.reduce((acc, task) => {
            task.depends_on.forEach(dependency => {
                const dependencyTask = tasks.find(t => t.id === dependency);
                if (dependencyTask) {
                    acc.push({
                        id: `edge-${task.id}-${dependency}`,
                        source: `node-${dependencyTask.id}`,
                        target: `node-${task.id}`,
                        className: 'cpm-edge'
                    });
                }
            });
            return acc;
        }, [] as Edge[]);

        setNodes(newNodes);
        setEdges(newEdges);
    };

    return {
        nodes,
        edges,
        setNodes,
        setEdges,
        onNodesChange,
        onEdgesChange
    };
};
