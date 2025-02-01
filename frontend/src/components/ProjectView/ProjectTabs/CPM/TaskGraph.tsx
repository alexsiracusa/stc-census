import React, {useEffect, useRef} from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

import './TaskGraph.css';
import {Task} from "../../../../types/task.ts";
import {TaskStatus, TaskStatuses} from "../../../../types/TaskStatuses.ts";

cytoscape.use(dagre);

export const cytoscapeLayout = {
    name: 'dagre' as const,
    rankDir: 'LR',
    padding: 0,
    spacingFactor: 1.5,
    nodeDimensionsIncludeLabels: true
};

export const cytoscapeStyles = [
    {
        selector: 'node',
        style: {
            'label': 'data(label)',
            'text-wrap': 'wrap',
            'text-max-width': '100%',
            'width': '120%',
            'height': '50%',
            'font-size': '15%',
            'text-valign': 'center',
            'text-halign': 'center',
            'background-color': '#666',
            'shape': 'roundrectangle',
            'color': '#fff'
        }
    },
    {
        selector: `node[status = "${TaskStatuses.DONE}"]`,
        style: {
            'background-color': '#4CAF50'
        }
    },
    {
        selector: `node[status = "${TaskStatuses.IN_PROGRESS}"]`,
        style: {
            'background-color': '#2196F3'
        }
    },
    {
        selector: `node[status = "${TaskStatuses.ON_HOLD}"]`,
        style: {
            'background-color': '#dfa100',
            'color': '#000'
        }
    },
    {
        selector: 'edge',
        style: {
            'width': 3,
            'line-color': '#999',
            'target-arrow-color': '#999',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
        }
    }
];

export interface TaskNode {
    id: string;
    label: string;
    status: TaskStatus;
}

export interface TaskEdge {
    source: string;
    target: string;
}

export interface TaskGraphProps {
    className?: string;
    tasks?: Task[];
}

export const initializeCytoscape = (
    container: HTMLDivElement,
    nodes: TaskNode[],
    edges: TaskEdge[]
) => {
    return cytoscape({
        container,
        elements: {
            nodes: nodes.map(node => ({
                data: {...node}
            })),
            edges: edges.map(edge => ({
                data: {...edge}
            }))
        },
        style: cytoscapeStyles,
        layout: cytoscapeLayout
    });
};
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
        return dependencies.map(dependency => ({
            source: String(dependency.task_id),
            target: String(task.id)
        }));
    });
};
export const useCytoscape = (containerRef: React.RefObject<HTMLDivElement>, tasks: Task[]) => {
    const cyRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const nodes = convertTasksToNodes(tasks);
        const edges = convertTasksToEdges(tasks);

        cyRef.current = initializeCytoscape(containerRef.current, nodes, edges);

        return () => {
            if (cyRef.current) {
                cyRef.current.destroy();
            }
        };
    }, [tasks]);

    return cyRef;
};
const TaskGraph: React.FC<TaskGraphProps> = ({ className = '', tasks = [] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useCytoscape(containerRef, tasks);

    return (
        <div
            ref={containerRef}
            className={`taskGraphContainer ${className}`}
        />
    );
};

export default TaskGraph;