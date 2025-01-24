// styles/cytoscapeStyles.ts
export const cytoscapeStyles = [
    {
        selector: 'node',
        style: {
            'label': 'data(label)',
            'text-wrap': 'wrap',
            'text-max-width': '80px',
            'width': '100px',
            'height': '100px',
            'font-size': '12px',
            'text-valign': 'center',
            'text-halign': 'center',
            'background-color': '#666',
            'shape': 'roundrectangle',
            'color': '#fff'
        }
    },
    {
        selector: 'node[status = "done"]',
        style: {
            'background-color': '#4CAF50'
        }
    },
    {
        selector: 'node[status = "in_progress"]',
        style: {
            'background-color': '#2196F3'
        }
    },
    {
        selector: 'node[status = "on_hold"]',
        style: {
            'background-color': '#FFC107'
        }
    },
    {
        selector: 'edge',
        style: {
            'width': 2,
            'line-color': '#999',
            'target-arrow-color': '#999',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier'
        }
    }
];
