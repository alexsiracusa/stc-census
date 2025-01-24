import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { Task } from './Data/Task.tsx';

// Register the dagre layout
cytoscape.use(dagre);

// TypeScript interfaces
interface TaskNode {
    id: string;
    label: string;
    status: 'done' | 'in_progress' | 'on_hold' | 'not_started';
}

interface TaskEdge {
    source: string;
    target: string;
}

interface TaskGraphProps {
    className?: string;
    style?: React.CSSProperties;
    tasks?: Task[]; // Add tasks prop
}

const TaskGraph: React.FC<TaskGraphProps> = ({ className, style, tasks = [] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<any>(null);

    // Convert tasks to the format needed for cytoscape
    const nodes: TaskNode[] = tasks.map(task => ({
        id: task.id,
        label: task.name,
        status: task.status
    }));

    // Create edges based on task dependencies, converting number IDs to strings
    const edges: TaskEdge[] = tasks.flatMap(task => {
        // Check if depends_on exists and is an array
        const dependencies = task.depends_on || [];
        return dependencies.map(dependencyId => ({
            source: String(dependencyId), // Convert number to string
            target: String(task.id) // Ensure target is also a string
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
            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(label)',
                        'text-wrap': 'wrap',
                        'text-max-width': '80px',
                        'width': '100px',
                        'height': '100px',
                        'font-size': '12px',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'background-color': '#666',
                        'shape': 'roundrectangle',
                        'color': '#fff'
                    }
                },
                {
                    selector: 'node[status = "done"]',
                    style: {
                        'background-color': '#4CAF50'
                    }
                },
                {
                    selector: 'node[status = "in_progress"]',
                    style: {
                        'background-color': '#2196F3'
                    }
                },
                {
                    selector: 'node[status = "on_hold"]',
                    style: {
                        'background-color': '#FFC107'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 2,
                        'line-color': '#999',
                        'target-arrow-color': '#999',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier'
                    }
                }
            ],
            layout: {
                name: 'dagre',
                rankDir: 'LR',
                padding: 50,
                spacingFactor: 1.5,
                animate: true,
                animationDuration: 500,
                nodeDimensionsIncludeLabels: true
            }
        });

        return () => {
            if (cyRef.current) {
                cyRef.current.destroy();
            }
        };
    }, [tasks]); // Keep tasks in dependency array

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                width: '100%',
                height: '600px',
                ...style
            }}
        />
    );
};
export default TaskGraph;
