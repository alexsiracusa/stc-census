// This is fed into the cytoscape instance to style the nodes and edges of the graph.
// Yes, it has to be formatted like this.

import { TaskStatusInfo } from "../../../../../../types/TaskStatuses.ts";

export const taskGraphStyles = [
    {
        selector: 'node',
        style: {
            'background-clip': 'none',
            'background-color': '#ffffff',
            'background-fit': 'none',
            'background-height': '100%',
            'background-image': (ele: any) => {
                const status = ele.data('status');
                const color = TaskStatusInfo[status]?.color || TaskStatusInfo['to_do'].color;
                const encodedSvg = encodeURIComponent(`
                    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                        <rect x="80%" y="80%" width="15%" height="15%" rx="2" ry="2" fill="${color}"/>
                    </svg>
                `.trim());
                return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
            },
            'background-image-containment': 'over',
            'background-image-opacity': 1,
            'background-width': '100%',
            'border-color': '#999',
            'border-style': 'solid',
            'border-width': '1px',
            'color': '#000',
            'font-size': '12%',
            'height': '90%',
            'label': 'data(label)',
            'opacity': 1,
            'shape': 'roundrectangle',
            'text-halign': 'center',
            'text-max-width': '150%',
            'text-valign': 'center',
            'text-wrap': 'wrap',
            'width': '120%',
        }
    },
    {
        // Red border for critical tasks
        selector: 'node[?isCritical]',
        style: {
            'border-color': '#ff0000',
            'border-style': 'solid',
            'border-width': '2px'
        }
    },
    {
        // Dashed border for tasks that belong to other projects
        selector: 'node[?isExternalProject]',
        style: {
            'border-style': 'dashed',
            'border-width': '2px'
        }
    },
    {
        selector: 'edge',
        style: {
            'curve-style': 'bezier',
            'line-color': '#999',
            'target-arrow-color': '#999',
            'target-arrow-shape': 'triangle',
            'width': 3
        }
    }
];
