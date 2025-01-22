export interface Task {
    id: number;
    parent: number;
    name: string;
    description: null | string;
    status: 'not_started' | 'in_progress' |'on-hold' | 'complete';
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