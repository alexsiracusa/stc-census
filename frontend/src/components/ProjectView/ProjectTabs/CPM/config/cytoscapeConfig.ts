// config/cytoscapeConfig.ts
import cytoscape from 'cytoscape';
import { TaskNode, TaskEdge } from '../utils/types';
import { cytoscapeStyles } from '../styles/cytoscapeStyles';
import { cytoscapeLayout } from './cytoscapeLayout';

export const initializeCytoscape = (
    container: HTMLDivElement,
    nodes: TaskNode[],
    edges: TaskEdge[]
) => {
    return cytoscape({
        container,
        elements: {
            nodes: nodes.map(node => ({
                data: { ...node }
            })),
            edges: edges.map(edge => ({
                data: { ...edge }
            }))
        },
        style: cytoscapeStyles,
        layout: cytoscapeLayout
    });
};
