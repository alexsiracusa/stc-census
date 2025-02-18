// This is fed into the cytoscape instance to style the nodes and edges of the graph.
// Yes, it has to be formatted like this.

import { TaskStatusInfo } from "../../../../../../../types/TaskStatuses.ts";

export const taskGraphStyles = [
    {
        selector: 'node',
        style: {
            'background-clip': 'none',
            'background-color': (ele: any) => {
                const status = ele.data('status');
                return TaskStatusInfo[status]?.color || TaskStatusInfo['to_do'].color;
            },
            'background-opacity': 0.45,
            'background-fit': 'none',
            'background-height': '100%',
            'background-image': (ele: any) => {
                const slack = ele.data('tooltip').split('\n')[0].split(': ')[1].trim();
                const encodedSvg = encodeURIComponent(`
                    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                        <text x="80%" y="90%" font-family="Arial" font-size="12" fill="#000000">${slack}</text>
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
            'text-max-width': '110%',
            'text-valign': 'center',
            'text-wrap': 'wrap',
            'width': '120%',
            'tooltip': 'data(tooltipText)'
        }
    },
    {
        selector: 'node[?isCritical]',
        style: {
            'border-color': '#000080',
            'border-width': '5px',
            'font-weight': 'bold'
        }
    },
    {
        selector: 'node[?inCycle]',
        style: {
            'border-color': '#ff0000',
            'border-width': '5px'
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
