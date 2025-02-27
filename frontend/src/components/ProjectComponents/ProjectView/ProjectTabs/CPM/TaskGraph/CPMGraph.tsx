import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import './CPMGraph.css';
import { Task } from "../../../../../../types/Task.ts";
import { TaskStatus, TaskStatusInfo } from "../../../../../../types/TaskStatuses.ts";
import { taskGraphStyles } from "./utils/taskGraphStyles.ts";
import { useSelector } from 'react-redux';

cytoscape.use(dagre);

interface CpmData {
    id: number;
    project_id: number;
    earliest_start: number;
    earliest_finish: number;
    latest_start: number;
    latest_finish: number;
    slack: number;
    is_critical: boolean;
}

interface TaskInCycle {
    id: number;
    project_id: number;
}

interface TaskGraphProps {
    className?: string;
    currentProjectId?: number;
    cpmData?: CpmData[];
    cycleInfo?: TaskInCycle[];
}

const CPMGraph: React.FC<TaskGraphProps> = ({
                                                 className = '',
                                                 currentProjectId,
                                                 cpmData = [],
                                                 cycleInfo = []
                                             }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cyRef = useRef<any>(null);

    // Fetch tasks directly from Redux
    const allProjects = useSelector((state: any) => state.projects.byId);

    // Collect all relevant tasks (from the current project and from any other projects referenced in cpmData)
    const tasks: Task[] = [];

    console.log(cpmData);
    // Get tasks referenced in cpmData
    const relevantProjectIds = new Set<number>();
    cpmData.forEach(item => {
        relevantProjectIds.add(item.project_id);
    });

    // Add tasks from all relevant projects
    relevantProjectIds.forEach(projectId => {
        const project = allProjects[projectId];
        if (project && project.byId) {
            Object.values(project.byId).forEach((task: any) => {
                tasks.push(task);
            });
        }
    });

    // If we have the current project's all_tasks array, we can also use that to ensure all tasks are included
    if (currentProjectId && allProjects[currentProjectId]?.all_tasks) {
        allProjects[currentProjectId].all_tasks.forEach((taskRef: any) => {
            // Check if this task exists in any project and isn't already in our tasks array
            const projectWithTask = allProjects[taskRef.project_id];
            if (projectWithTask?.byId && projectWithTask.byId[taskRef.task_id]) {
                const task = projectWithTask.byId[taskRef.task_id];
                if (!tasks.some(t => t.id === task.id && t.project_id === task.project_id)) {
                    tasks.push(task);
                }
            }
        });
    }

    // Format tooltip using the task info and corresponding CPM data.
    const formatTooltip = (task: Task, cpm: CpmData) => {
        const padNumber = (num: number): string => num.toString().padStart(2, ' ');
        const statusInfo = TaskStatusInfo[task.status as TaskStatus];
        const presentableStatus = statusInfo ? statusInfo.name : task.status;
        const formatDays = (num: number) => `${padNumber(num)} ${num === 1 ? 'day' : 'days'}`;
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
        // If no container or no tasks are available, cleanup and exit.
        if (!containerRef.current || tasks.length === 0) {
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
                    status: task.status,
                    project_id: task.project_id,
                    isCritical: cpm ? cpm.is_critical : false,
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

        // Show tooltip on node hover.
        cyRef.current.on('mouseover', 'node', (event: any) => {
            const node = event.target;
            if (containerRef.current && node.data('tooltip')) {
                containerRef.current.setAttribute('title', node.data('tooltip'));
            }
        });

        // Remove tooltip when the mouse leaves.
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
    }, [tasks, currentProjectId, cpmData, cycleInfo]);

    if (tasks.length === 0) {
        return (
            <div className={`taskGraphContainer ${className}`}>
                <p>No tasks available</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={`taskGraphContainer ${className}`} />
    );
};

export default CPMGraph;
