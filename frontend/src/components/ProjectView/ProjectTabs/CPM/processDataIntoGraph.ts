import { useEffect } from 'react';
import { Node, Edge, useNodesState, useEdgesState } from 'reactflow';
import { Task } from './Task';

interface UseGraphProcessorReturn {
    nodes: Node[];
    edges: Edge[];
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    onNodesChange: (changes: any) => void;
    onEdgesChange: (changes: any) => void;
}

export const useGraphProcessor = (tasks: Task[]): UseGraphProcessorReturn => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (tasks.length > 0) {
            processTasksIntoGraph(tasks);
        }
    }, [tasks]);

    const processTasksIntoGraph = (tasks: Task[]) => {
        const newNodes = tasks.map((task) => ({
            id: `node-${task.id}`,
            type: 'task',
            position: { x: 0, y: 0 }, // Default position will be handled by layout
            data: task,
            className: 'cpm-node'
        }));

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
