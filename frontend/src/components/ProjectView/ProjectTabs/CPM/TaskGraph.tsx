// components/TaskGraph.tsx
import React, { useRef } from 'react';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import { TaskGraphProps } from "./utils/types";
import { defaultContainerStyle } from './styles/containerStyles';
import { useCytoscape } from './hooks/useCytoscape.ts';

// Register the dagre layout
cytoscape.use(dagre);

const TaskGraph: React.FC<TaskGraphProps> = ({ className, style, tasks = [] }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    useCytoscape(containerRef, tasks);

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
