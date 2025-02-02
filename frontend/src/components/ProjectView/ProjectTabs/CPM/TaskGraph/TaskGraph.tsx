import React, {useEffect, useRef} from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import './TaskGraph.css';
import {Task} from "../../../../../types/Task.ts";
import {TaskStatuses} from "../../../../../types/TaskStatuses.ts";

cytoscape.use(dagre);

const TaskGraph: React.FC<{
    className?: string;
    tasks?: Task[];
    currentProjectId?: number; // Add current project ID prop
}> = ({ className = '', tasks = [], currentProjectId }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const nodes = tasks.map(task => ({
            data: {
                id: `${task.project_id}-${task.id}`, // Combine project and task IDs
                label: task.name,
                status: task.status,
                project_id: task.project_id, // Add project ID to data
                isExternalProject: task.project_id !== currentProjectId
            }
        }));

        const edges = tasks.flatMap(task => (task.depends_on || []).map(dependency => ({
            data: {
                // Update source and target to use combined IDs
                source: `${dependency.project_id}-${dependency.task_id}`,
                target: `${task.project_id}-${task.id}`
            }
        })));

        cyRef.current = cytoscape({
            container: containerRef.current,
            elements: { nodes, edges },
            style: [
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
                        'color': '#fff',
                        'opacity': 1
                    }
                },
                {
                    // Style for external project nodes
                    selector: 'node[?isExternalProject]',
                    style: {
                        'opacity': 0.6,
                        'color': '#fff'
                    }
                },
                {
                    selector: `node[status = "${TaskStatuses.DONE}"]`,
                    style: {
                        'background-color': '#4CAF50',
                        'opacity': 'data(isExternalProject) ? 0.8 : 1'
                    }
                },
                {
                    selector: `node[status = "${TaskStatuses.IN_PROGRESS}"]`,
                    style: {
                        'background-color': '#2196F3',
                        'opacity': 'data(isExternalProject) ? 0.8 : 1'
                    }
                },
                {
                    selector: `node[status = "${TaskStatuses.ON_HOLD}"]`,
                    style: {
                        'background-color': '#dfa100',
                        'color': '#000',
                        'opacity': 'data(isExternalProject) ? 0.8 : 1'
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
            ],
            layout: {
                name: 'dagre',
                rankDir: 'LR',
                padding: 0,
                spacingFactor: 1.5,
                nodeDimensionsIncludeLabels: true
            }
        });

        return () => {
            if (cyRef.current) {
                cyRef.current.destroy();
            }
        };
    }, [tasks, currentProjectId]);

    return (
        <div
            ref={containerRef}
            className={`taskGraphContainer ${className}`}
        />
    );
};

export default TaskGraph;
