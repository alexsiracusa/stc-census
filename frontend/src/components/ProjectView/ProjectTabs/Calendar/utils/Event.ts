import { Event } from '../Calendar';
import { TaskStatusInfo } from "../../../../../types/TaskStatuses.ts";

export const convertTasksToEvents = (tasks: any): Event[] => {
    return Object.values(tasks).map((task: any) => ({
        id: task.id,
        title: task.name || 'Untitled Task',
        color: TaskStatusInfo[task.status]?.color || '#003366',
        startDate: task.target_start_date || 'N/A',
        endDate: task.target_completion_date || task.target_start_date || 'N/A',
        note: task.description || 'No details available',
        status: TaskStatusInfo[task.status]?.name || 'Unknown',
    }));
};


