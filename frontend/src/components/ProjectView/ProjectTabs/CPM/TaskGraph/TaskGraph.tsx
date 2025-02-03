import React, {useEffect, useRef} from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import './TaskGraph.css';
import {Task} from "../../../../../types/Task.ts";
import {taskGraphStyles} from "./utils/taskGraphStyles.ts";

cytoscape.use(dagre);

const TaskGraph: React.FC<{
    className?: string;
    tasks?: Task[];
    currentProjectId?: number;
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
            style: taskGraphStyles,
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
