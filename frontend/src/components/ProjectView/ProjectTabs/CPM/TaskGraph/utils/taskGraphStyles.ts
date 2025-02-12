// This is fed into the cytoscape instance to style the nodes and edges of the graph.
// Yes, it has to be formatted like this.

import { TaskStatusInfo } from "../../../../../../types/TaskStatuses.ts";

export const taskGraphStyles = [
    {
        selector: 'node',
        style: {
            'background-color': (ele: any) => {
                const status = ele.data('status');
                return TaskStatusInfo[status]?.color || TaskStatusInfo['to_do'].color;
            },
            'background-opacity': 0.45,
            'border-color': '#999',
            'border-style': 'solid',
            'border-width': '1px',
            'color': '#000',
            'font-size': '12px', // Fixed font size
            'height': '90%',
            'label': (ele: any) => {
                const slack = ele.data('slack');
                const taskName = ele.data('label');
                return `${taskName}\nSlack: ${slack}`;
            },
            'text-halign': 'center',
            'text-max-width': '150%',
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
            'border-width': '2px'
        }
    },
    {
        selector: 'node[?inCycle]',
        style: {
            'border-color': '#ff0000',
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
