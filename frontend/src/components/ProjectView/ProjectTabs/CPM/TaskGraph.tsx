import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { TaskEdge, TaskGraphProps, TaskNode } from "./utils/types.ts";
import { cytoscapeStyles } from './styles/cytoscapeStyles';
import { cytoscapeLayout } from './config/cytoscapeLayout';
import { defaultContainerStyle } from './styles/containerStyles';

// Register the dagre layout
cytoscape.use(dagre);

const TaskGraph: React.FC<TaskGraphProps> = ({ className, style, tasks = [] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<any>(null);

    // Convert tasks to the format needed for cytoscape
    const nodes: TaskNode[] = tasks.map(task => ({
        id: String(task.id),
        label: task.name,
        status: task.status
    }));

    const edges: TaskEdge[] = tasks.flatMap(task => {
        const dependencies = task.depends_on || [];
        return dependencies.map(dependencyId => ({
            source: String(dependencyId),
            target: String(task.id)
        }));
    });

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize cytoscape
        cyRef.current = cytoscape({
            container: containerRef.current,
            elements: {
                nodes: nodes.map(node => ({
                    data: { ...node }
                })),
                edges: edges.map(edge => ({
                    data: { ...edge }
                }))
            },
            style: cytoscapeStyles,
            layout: cytoscapeLayout
        });

        return () => {
            if (cyRef.current) {
                cyRef.current.destroy();
            }
        };
    }, [tasks]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                ...defaultContainerStyle,
                ...style
            }}
        />
    );
};

export default TaskGraph;
