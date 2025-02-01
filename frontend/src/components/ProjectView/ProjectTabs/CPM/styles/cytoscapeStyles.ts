import {TaskStatuses} from "../../../../../types/TaskStatuses.ts";

export const cytoscapeStyles = [
    {
        selector: 'node',
        style: {
            'label': 'data(label)',
            'text-wrap': 'wrap',
            'text-max-width': '100%',
            'width': '120%',
            'height': '50%',
            'font-size': '15%',
            'text-valign': 'center',
            'text-halign': 'center',
            'background-color': '#666',
            'shape': 'roundrectangle',
            'color': '#fff'
        }
    },
    {
        selector: `node[status = "${TaskStatuses.DONE}"]`,
        style: {
            'background-color': '#4CAF50'
        }
    },
    {
        selector: `node[status = "${TaskStatuses.IN_PROGRESS}"]`,
        style: {
            'background-color': '#2196F3'
        }
    },
    {
        selector: `node[status = "${TaskStatuses.ON_HOLD}"]`,
        style: {
            'background-color': '#dfa100',
            'color': '#000'
        }
    },
    {
        selector: 'edge',
        style: {
            'width': 3,
            'line-color': '#999',
            'target-arrow-color': '#999',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
        }
    }
];
