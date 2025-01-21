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
    data: Task;
}

const TaskNode: React.FC<TaskNodeProps> = ({ data }) => {
    return (
        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '10px' }}>
            <h4>Task {data.id}: {data.name}</h4>
            <p>Status: {data.status}</p>
            <p>Created At: {data.created_at}</p>
            <p>Start Date: {data.start_date || 'Not set'}</p>
            <p>Completion Date: {data.completion_date || 'Not set'}</p>
            <p>Target Start Date: {data.target_start_date || 'Not set'}</p>
            <p>Target Completion Date: {data.target_completion_date || 'Not set'}</p>
            <p>Target Days to Complete: {data.target_days_to_complete || 'Not set'}</p>
            <p>Actual Cost: {data.actual_cost || 'Not set'}</p>
            <p>Expected Cost: {data.expected_cost || 'Not set'}</p>
            <p>Depends On: {data.depends_on.join(', ') || 'None'}</p>
            {data.description && <p>Description: {data.description}</p>}
        </div>
    );
};

export default TaskNode;
