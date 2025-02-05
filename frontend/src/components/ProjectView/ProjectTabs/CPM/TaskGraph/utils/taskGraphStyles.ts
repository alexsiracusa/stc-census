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
            'background-color': '#ffffff',
            'shape': 'roundrectangle',
            'color': '#000',
            'opacity': 1,
            // Add a status indicator using background-image
            'background-image-opacity': 1,
            'background-image': (ele: any) => {
                const status = ele.data('status');
                const color = TaskStatusInfo[status]?.color || TaskStatusInfo['to_do'].color;
                // Create a small colored square as SVG with proper encoding
                const encodedSvg = encodeURIComponent(`
                    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                        <rect x="80%" y="80%" width="15%" height="15%" rx="2" ry="2" fill="${color}"/>
                    </svg>
                `.trim());
                return `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
            },
            // Ensure proper background image rendering
            'background-fit': 'none',
            'background-clip': 'none',
            'background-image-containment': 'over',
            'background-width': '100%',
            'background-height': '100%',
            'border-width': '1px',
            'border-color': '#999',
            'border-style': 'solid'
        }
    },
    {
        // Red border for critical tasks
        selector: 'node[?isCritical]',
        style: {
            'border-width': '2px',
            'border-color': '#ff0000',
            'border-style': 'solid'
        }
    },
    {
        // Transparent nodes for tasks that belong to other projects
        selector: 'node[?isExternalProject]',
        style: {
            'opacity': OPACITY,
            'background-image-opacity': OPACITY
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
