/* TaskGraph.tsx */
import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import './TaskGraph.css';
import { Task } from "../../../../../types/Task.ts";
import {TaskStatus, TaskStatusInfo} from "../../../../../types/TaskStatuses.ts";
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

interface TaskInCycle {
    id: number;
    project_id: number;
}

const TaskGraph: React.FC<{
    className?: string;
    tasks?: Task[];
    currentProjectId?: number;
    cpmData?: CpmData[];
    cycleInfo?: TaskInCycle[];
}> = ({ className = '', tasks = [], currentProjectId, cpmData = [], cycleInfo = [] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<any>(null);

    const formatTooltip = (task: Task, cpm: CpmData) => {
        const padNumber = (num: number): string => num.toString().padStart(2, ' ');

        const statusInfo = TaskStatusInfo[task.status as TaskStatus];
        const presentableStatus = statusInfo ? statusInfo.name : task.status;

        const formatDays = (num) => `${padNumber(num)} ${num === 1 ? 'day' : 'days'}`;

        return [
            `Slack: ${padNumber(cpm.slack)}`,
            '',
            `Earliest Start (ES): ${formatDays(cpm.earliest_start)}    Latest Start (LS): ${formatDays(cpm.latest_start)}`,
            `Earliest Finish (EF): ${formatDays(cpm.earliest_finish)}    Latest Finish (LF): ${formatDays(cpm.latest_finish)}`,
            '',
            `Status: ${presentableStatus}`
        ].join('\n');
    };

    useEffect(() => {
        // Early return if no tasks
        if (!containerRef.current || tasks.length === 0) {
            // Optional: You could render a placeholder or empty state
            return () => {
                if (cyRef.current) {
                    cyRef.current.destroy();
                }
            };
        }

        const nodes = tasks.map(task => {
            const cpm = cpmData.find(c => c.id === task.id && c.project_id === task.project_id);
            const isInCycle = cycleInfo.some(c => c.id === task.id && c.project_id === task.project_id);
            const tooltip = cpm ? formatTooltip(task, cpm) : '';
            return {
                data: {
                    id: `${task.project_id}-${task.id}`,
                    label: task.name,
                    tooltip,
                    tooltipText: tooltip, // Add explicit tooltipText for styling
                    status: task.status,
                    project_id: task.project_id,
                    isCritical: cpm ? cpm.critical : false,
                    inCycle: isInCycle,
                    slack: cpm ? cpm.slack : 0
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

        cyRef.current.on('mouseover', 'node', (event) => {
            const node = event.target;
            if (containerRef.current && node.data('tooltip')) {
                containerRef.current.setAttribute('title', node.data('tooltip'));
            }
        });

        cyRef.current.on('mouseout', 'node', () => {
            if (containerRef.current) {
                containerRef.current.removeAttribute('title');
            }
        });

        return () => {
            if (cyRef.current) {
                cyRef.current.destroy();
            }
        };
    }, [tasks, currentProjectId, cpmData]);

    // Render a placeholder if no tasks
    if (tasks.length === 0) {
        return (
            <div className={`taskGraphContainer ${className}`}>
                <p>No tasks available</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`taskGraphContainer ${className}`}
        />
    );
};

export default TaskGraph;
