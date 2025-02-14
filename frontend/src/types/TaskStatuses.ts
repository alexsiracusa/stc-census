export const TaskStatuses = [
    'to_do',
    'in_progress',
    'on_hold',
    'done'
];

export const TaskStatusInfo: Record<TaskStatus, { name: string, color: string }> = {
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
    'done': {
        name: 'Done',
        color: '#008a1e'
    }
}

export type TaskStatus = typeof TaskStatuses[number];