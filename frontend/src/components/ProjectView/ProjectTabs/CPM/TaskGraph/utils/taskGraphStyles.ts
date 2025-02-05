import { TaskStatusInfo } from "../../../../../../types/TaskStatuses.ts";

const OPACITY = 0.7;

// This is fed into the cytoscape instance to style the nodes and edges of the graph.
// Yes, it has to be formatted like this.
export const taskGraphStyles = [
    {
        selector: 'node',
        style: {
            'label': 'data(label)',
            'text-wrap': 'wrap',
            'text-max-width': '150%',
            'width': '120%',
            'height': '90%',
            'font-size': '12%',
            'text-valign': 'center',
            'text-halign': 'center',
            'background-color': TaskStatusInfo['to_do'].color,
            'shape': 'roundrectangle',
            'color': '#fff',
            'opacity': 1
        }
    },
    {
        // Red border for critical tasks.
        selector: 'node[?isCritical]',
        style: {
            'border-width': '2px',
            'border-color': '#ff0000',
            'border-style': 'solid'
        }
    },
    {
        // Transparent nodes for tasks that belong to other projects.
        // !!! Note: may need to differentiate between external tasks that do or do not belong to a subproject.
        selector: 'node[?isExternalProject]',
        style: {
            'opacity': OPACITY,
        }
    },
    {
        selector: `node[status = "done"]`,
        style: {
            'background-color': TaskStatusInfo['done'].color,
            'opacity': `data(isExternalProject) ? ${OPACITY} : 1`
        }
    },
    {
        selector: `node[status = "in_progress"]`,
        style: {
            'background-color': TaskStatusInfo['in_progress'].color,
            'opacity': `data(isExternalProject) ? ${OPACITY} : 1`
        }
    },
    {
        selector: `node[status = "on_hold"]`,
        style: {
            'background-color': TaskStatusInfo['on_hold'].color,
            'color': '#000',
            'opacity': `data(isExternalProject) ? ${OPACITY} : 1`
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
