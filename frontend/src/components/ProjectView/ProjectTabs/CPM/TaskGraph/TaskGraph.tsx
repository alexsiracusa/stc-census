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
    cpmData?: Record<number, any>;
}> = ({ className = '', tasks = [], currentProjectId, cpmData = {} }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const nodes = tasks.map(task => ({
            data: {
                id: `${task.project_id}-${task.id}`,
                label: formatNodeLabel(task, cpmData[task.id]),
                status: task.status,
                project_id: task.project_id,
                isExternalProject: task.project_id !== currentProjectId,
                isCritical: cpmData[task.id]?.critical
            }
        }));

        const edges = tasks.flatMap(task => (task.depends_on || []).map(dependency => ({
            data: {
                source: `${dependency.project_id}-${dependency.task_id}`,
                target: `${task.project_id}-${task.id}`
            }
        })));

        const updatedStyles = [
            ...taskGraphStyles,
            {
                selector: 'node[isCritical]',
                style: {
                    'border-width': '5%',
                    'border-color': '#ff0000'
                }
            }
        ];

        cyRef.current = cytoscape({
            container: containerRef.current,
            elements: {nodes, edges},
            layout: {
                name: 'dagre',
                rankDir: 'LR',
                padding: 0,
                spacingFactor: 1.5,
                nodeDimensionsIncludeLabels: true
            },
            style: updatedStyles
        });

        return () => {
            if (cyRef.current) {
                cyRef.current.destroy();
            }
        };
    }, [tasks, currentProjectId]);

    const formatNodeLabel = (task: Task, cpm: any) => {
        if (!cpm) return task.name;

        return `${task.name}
                ES: ${cpm.es} | EF: ${cpm.ef}
                LS: ${cpm.ls} | LF: ${cpm.lf}
                Slack: ${cpm.slack} ${cpm.critical ? '⏰' : ''}`;
    };

    return (
        <div
            ref={containerRef}
            className={`taskGraphContainer ${className}`}
        />
    );
};

export default TaskGraph;
