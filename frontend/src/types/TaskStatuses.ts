export type TaskStatus = 'to_do' | 'in_progress' | 'on_hold' | 'done';

export const TaskStatuses = {
    TODO: 'to_do' as TaskStatus,
    IN_PROGRESS: 'in_progress' as TaskStatus,
    ON_HOLD: 'on_hold' as TaskStatus,
    DONE: 'done' as TaskStatus,
} as const;
