// hooks/useCytoscape.ts
import React, { useEffect, useRef } from 'react';
import { Task } from '../utils/task.ts';
import { convertTasksToNodes, convertTasksToEdges } from '../utils/cytoscapeConverters';
import { initializeCytoscape } from '../config/cytoscapeConfig';

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
