import { TaskStatusInfo } from "../../../../../../types/TaskStatuses.ts";

// This is fed into the cytoscape instance to style the nodes and edges of the graph.
// Yes, it has to be formatted like this.
export const taskGraphStyles = [
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
            'background-color': TaskStatusInfo['to_do'].color,
            'shape': 'roundrectangle',
            'color': '#fff',
            'opacity': 1
        }
    },
    {
        selector: 'node[?isExternalProject]',
        style: {
            'opacity': 0.6,
            'color': '#fff'
        }
    },
    {
        selector: `node[status = "done"]`,
        style: {
            'background-color': TaskStatusInfo['done'].color,
            'opacity': 'data(isExternalProject) ? 0.8 : 1'
        }
    },
    {
        selector: `node[status = "in_progress"]`,
        style: {
            'background-color': TaskStatusInfo['in_progress'].color,
            'opacity': 'data(isExternalProject) ? 0.8 : 1'
        }
    },
    {
        selector: `node[status = "on_hold"]`,
        style: {
            'background-color': TaskStatusInfo['on_hold'].color,
            'color': '#000',
            'opacity': 'data(isExternalProject) ? 0.8 : 1'
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
