import React, {useEffect, useRef} from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import './TaskGraph.css';
import {Task} from "../../../../../types/Task.ts";
import {TaskStatusInfo} from "../../../../../types/TaskStatuses.ts";

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
                id: `${task.project_id}-${task.id}`,
                label: task.name,
                status: task.status,
                project_id: task.project_id,
                isExternalProject: task.project_id !== currentProjectId
            }
        }));

        const edges = tasks.flatMap(task => (task.depends_on || []).map(dependency => ({
            data: {
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
                        'background-color': TaskStatusInfo['to_do'].color,
                        'shape': 'roundrectangle',
                        'color': '#fff',
                        'opacity': 1
                    }
                },
                {
                    selector: 'node[?isExternalProject]',
                    style: {
                        'opacity': 0.6,
                        'color': '#fff'
                    }
                },
                {
                    selector: `node[status = "done"]`,
                    style: {
                        'background-color': TaskStatusInfo['done'].color,
                        'opacity': 'data(isExternalProject) ? 0.8 : 1'
                    }
                },
                {
                    selector: `node[status = "in_progress"]`,
                    style: {
                        'background-color': TaskStatusInfo['in_progress'].color,
                        'opacity': 'data(isExternalProject) ? 0.8 : 1'
                    }
                },
                {
                    selector: `node[status = "on_hold"]`,
                    style: {
                        'background-color': TaskStatusInfo['on_hold'].color,
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
