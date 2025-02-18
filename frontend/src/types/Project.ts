import {ProjectStatus} from "./ProjectStatus.ts";


export interface Project {
    id: number;
    parent: number;
    name: string;
    description: null | string;
    status: ProjectStatus;
    budget: number | null;
    created_at: string;
    requested_by: string | null;
    date_requested: string | null;
    actual_start_date: null | string;
    actual_completion_date: null | string;
    target_start_date: null | string;
    target_completion_date: null | string;
    archived: boolean;
}