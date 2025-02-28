type Task = {
    id: number;
    name: string;
    status: string;
    created_at: string;
    depends_on: Array<{task_id: number, project_id: number}>;
    project_id: number;
    actual_cost: number | null;
    description: string | null;
    expected_cost: number | null;
    budget_variance: number | null;
    person_in_charge: {
        id: number;
        email: string;
        last_name: string;
        first_name: string;
    } | null;
    actual_start_date: string | null;
    target_start_date: string | null;
    person_in_charge_id: number | null;
    actual_completion_date: string | null;
    target_completion_date: string | null;
    target_days_to_complete: number | null;
};

type Project = {
    id: number;
    name: string;
    path: Array<{id: number, name: string}>;
    tasks: Task[];
    budget: number | null;
    parent: number | null;
    status: string;
    archived: boolean;
    created_at: string;
    actual_cost: number;
    description: string | null;
    requested_by: string | null;
    sub_projects: any[];
    expected_cost: number;
    status_counts: {
        done: number;
        to_do: number;
        on_hold: number;
        in_progress: number;
    };
    date_requested: string | null;
    budget_variance: number;
    team_email_alias: string;
    actual_start_date: string | null;
    target_start_date: string | null;
    person_in_charge_id: number | null;
    actual_completion_date: string | null;
    target_completion_date: string | null;
};

type ProjectData = {
    result: {
        project: Project;
        descendants: Project[];
    };
};

// Helper to escape CSV fields
const escapeCSV = (field: string | number | null | undefined): string => {
    if (field === null || field === undefined) {
        return '';
    }

    const fieldStr = String(field);
    // If the field contains commas, quotes, or newlines, wrap it in quotes
    if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
        // Double up any quotes within the field
        return `"${fieldStr.replace(/"/g, '""')}"`;
    }
    return fieldStr;
};

// Helper to format task dependencies
const formatDependencies = (depends_on: Array<{task_id: number, project_id: number}>): string => {
    if (!depends_on || depends_on.length === 0) return '';
    return depends_on.map(dep => `Task ${dep.task_id} (Project ${dep.project_id})`).join(', ');
};

// Helper to format person in charge
const formatPersonInCharge = (person: {id: number, email: string, last_name: string, first_name: string} | null): string => {
    if (!person) return '';
    return `${person.first_name} ${person.last_name} (${person.email})`;
};

// Convert project data to CSV format
export const convertProjectDataToCSV = (data: ProjectData): string => {
    // CSV Headers
    const headers = [
        'Project ID', 'Project Name', 'Project Path', 'Status', 'Budget', 'Expected Cost', 'Actual Cost', 'Budget Variance',
        'Target Start Date', 'Actual Start Date', 'Target Completion Date', 'Actual Completion Date',
        'Task ID', 'Task Name', 'Task Status', 'Task Description', 'Depends On', 'Expected Cost', 'Actual Cost', 'Budget Variance',
        'Person in Charge', 'Target Start Date', 'Actual Start Date', 'Target Completion Date', 'Actual Completion Date', 'Target Days to Complete'
    ].map(escapeCSV).join(',');

    const rows: string[] = [];

    // Process main project
    const mainProject = data.result.project;
    const mainProjectPath = mainProject.path.map(p => p.name).join(' > ');

    // Add rows for main project tasks
    if (mainProject.tasks && mainProject.tasks.length > 0) {
        mainProject.tasks.forEach(task => {
            const row = [
                escapeCSV(mainProject.id),
                escapeCSV(mainProject.name),
                escapeCSV(mainProjectPath),
                escapeCSV(mainProject.status),
                escapeCSV(mainProject.budget),
                escapeCSV(mainProject.expected_cost),
                escapeCSV(mainProject.actual_cost),
                escapeCSV(mainProject.budget_variance),
                escapeCSV(mainProject.target_start_date),
                escapeCSV(mainProject.actual_start_date),
                escapeCSV(mainProject.target_completion_date),
                escapeCSV(mainProject.actual_completion_date),
                escapeCSV(task.id),
                escapeCSV(task.name),
                escapeCSV(task.status),
                escapeCSV(task.description),
                escapeCSV(formatDependencies(task.depends_on)),
                escapeCSV(task.expected_cost),
                escapeCSV(task.actual_cost),
                escapeCSV(task.budget_variance),
                escapeCSV(formatPersonInCharge(task.person_in_charge)),
                escapeCSV(task.target_start_date),
                escapeCSV(task.actual_start_date),
                escapeCSV(task.target_completion_date),
                escapeCSV(task.actual_completion_date),
                escapeCSV(task.target_days_to_complete)
            ].join(',');

            rows.push(row);
        });
    } else {
        // Add a row for the project with no tasks
        const row = [
            escapeCSV(mainProject.id),
            escapeCSV(mainProject.name),
            escapeCSV(mainProjectPath),
            escapeCSV(mainProject.status),
            escapeCSV(mainProject.budget),
            escapeCSV(mainProject.expected_cost),
            escapeCSV(mainProject.actual_cost),
            escapeCSV(mainProject.budget_variance),
            escapeCSV(mainProject.target_start_date),
            escapeCSV(mainProject.actual_start_date),
            escapeCSV(mainProject.target_completion_date),
            escapeCSV(mainProject.actual_completion_date),
            '', '', '', '', '', '', '', '', '', '', '', '', '', ''
        ].join(',');

        rows.push(row);
    }

    // Process descendant projects
    if (data.result.descendants && data.result.descendants.length > 0) {
        data.result.descendants.forEach(project => {
            const projectPath = project.path.map(p => p.name).join(' > ');

            // Add rows for descendant project tasks
            if (project.tasks && project.tasks.length > 0) {
                project.tasks.forEach(task => {
                    const row = [
                        escapeCSV(project.id),
                        escapeCSV(project.name),
                        escapeCSV(projectPath),
                        escapeCSV(project.status),
                        escapeCSV(project.budget),
                        escapeCSV(project.expected_cost),
                        escapeCSV(project.actual_cost),
                        escapeCSV(project.budget_variance),
                        escapeCSV(project.target_start_date),
                        escapeCSV(project.actual_start_date),
                        escapeCSV(project.target_completion_date),
                        escapeCSV(project.actual_completion_date),
                        escapeCSV(task.id),
                        escapeCSV(task.name),
                        escapeCSV(task.status),
                        escapeCSV(task.description),
                        escapeCSV(formatDependencies(task.depends_on)),
                        escapeCSV(task.expected_cost),
                        escapeCSV(task.actual_cost),
                        escapeCSV(task.budget_variance),
                        escapeCSV(formatPersonInCharge(task.person_in_charge)),
                        escapeCSV(task.target_start_date),
                        escapeCSV(task.actual_start_date),
                        escapeCSV(task.target_completion_date),
                        escapeCSV(task.actual_completion_date),
                        escapeCSV(task.target_days_to_complete)
                    ].join(',');

                    rows.push(row);
                });
            } else {
                // Add a row for the project with no tasks
                const row = [
                    escapeCSV(project.id),
                    escapeCSV(project.name),
                    escapeCSV(projectPath),
                    escapeCSV(project.status),
                    escapeCSV(project.budget),
                    escapeCSV(project.expected_cost),
                    escapeCSV(project.actual_cost),
                    escapeCSV(project.budget_variance),
                    escapeCSV(project.target_start_date),
                    escapeCSV(project.actual_start_date),
                    escapeCSV(project.target_completion_date),
                    escapeCSV(project.actual_completion_date),
                    '', '', '', '', '', '', '', '', '', '', '', '', '', ''
                ].join(',');

                rows.push(row);
            }
        });
    }

    return [headers, ...rows].join('\n');
};

// Helper function to trigger CSV download
export const downloadCSV = (csvContent: string, filename: string): void => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
