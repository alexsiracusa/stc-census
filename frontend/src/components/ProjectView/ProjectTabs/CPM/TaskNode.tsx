// TaskNode.tsx
import React from 'react';

interface Task {
    id: number;
    parent: number;
    name: string;
    description: null | string;
    status: string;
    created_at: string;
    start_date: null | string;
    completion_date: null | string;
    target_start_date: null | string;
    target_completion_date: null | string;
    target_days_to_complete: null | number;
    actual_cost: null | number;
    expected_cost: null | number;
    depends_on: number[];
}

interface TaskNodeProps {
    task: Task;
}

const TaskNode: React.FC<TaskNodeProps> = ({ task }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h4>Task {task.id}: {task.name}</h4>
            <p>Status: {task.status}</p>
            <p>Created At: {task.created_at}</p>
            <p>Start Date: {task.start_date || 'Not set'}</p>
            <p>Completion Date: {task.completion_date || 'Not set'}</p>
            <p>Target Start Date: {task.target_start_date || 'Not set'}</p>
            <p>Target Completion Date: {task.target_completion_date || 'Not set'}</p>
            <p>Target Days to Complete: {task.target_days_to_complete || 'Not set'}</p>
            <p>Actual Cost: {task.actual_cost || 'Not set'}</p>
            <p>Expected Cost: {task.expected_cost || 'Not set'}</p>
            <p>Depends On: {task.depends_on.join(', ') || 'None'}</p>
            {task.description && <p>Description: {task.description}</p>}
        </div>
    );
};

export default TaskNode;
