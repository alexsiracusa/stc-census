import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import './TaskGraph.css';
import { Task } from "../../../../../types/Task.ts";
import { taskGraphStyles } from "./utils/taskGraphStyles.ts";

cytoscape.use(dagre);

interface CpmData {
    id: number;
    project_id: number;
    earliest_start: number;
    earliest_finish: number;
    latest_start: number;
    latest_finish: number;
    slack: number;
    critical: boolean;
}

const TaskGraph: React.FC<{
    className?: string;
    tasks?: Task[];
    currentProjectId?: number;
    cpmData?: CpmData[];
}> = ({ className = '', tasks = [], currentProjectId, cpmData = [] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const nodes = tasks.map(task => {
            const cpm = cpmData.find(c => c.id === task.id && c.project_id === task.project_id);
            return {
                data: {
                    id: `${task.project_id}-${task.id}`,
                    label: formatNodeLabel(task, cpm),
                    status: task.status,
                    project_id: task.project_id,
                    isExternalProject: task.project_id !== currentProjectId,
                    isCritical: cpm ? cpm.critical : false
                }
            };
        });

        const edges = tasks.flatMap(task =>
            (task.depends_on || []).map(dependency => ({
                data: {
                    source: `${dependency.project_id}-${dependency.task_id}`,
                    target: `${task.project_id}-${task.id}`
                }
            }))
        );


        cyRef.current = cytoscape({
            container: containerRef.current,
            elements: { nodes, edges },
            layout: {
                name: 'dagre',
                rankDir: 'LR',
                padding: 0,
                spacingFactor: 1,
                nodeDimensionsIncludeLabels: true
            },
            style: taskGraphStyles
        });

        return () => {
            if (cyRef.current) {
                cyRef.current.destroy();
            }
        };
    }, [tasks, currentProjectId, cpmData]);

    const formatNodeLabel = (task: Task, cpm?: CpmData) => {
        if (!cpm) return task.name;

        const padNumber = (num: number): string => num.toString().padStart(2, ' ');

        return [
            task.name,
            `Slack: ${padNumber(cpm.slack)}`,
            '',
            `ES: ${padNumber(cpm.earliest_start)}    LS: ${padNumber(cpm.latest_start)}`,
            `EF: ${padNumber(cpm.earliest_finish)}    LF: ${padNumber(cpm.latest_finish)}`,
            ''
        ].join('\n');
    };



    return (
        <div
            ref={containerRef}
            className={`taskGraphContainer ${className}`}
        />
    );
};

export default TaskGraph;