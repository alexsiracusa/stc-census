export const ProjectStatuses = [
    'to_do',
    'in_progress',
    'on_hold',
    'cancelled',
    'done'
];

export const ProjectStatusInfo: Record<ProjectStatus, { name: string, color: string }> = {
    'to_do': {
        name: 'Todo',
        color: '#919191'
    },
    'in_progress': {
        name: 'WiP',
        color: '#0053ba'
    },
    'on_hold': {
        name: 'On Hold',
        color: '#e0b000'
    },
    'cancelled': {
        name: 'Cancelled',
        color: '#cc1b00'
    },
    'done': {
        name: 'Done',
        color: '#008a1e'
    }
}

export type ProjectStatus = typeof ProjectStatuses[number];