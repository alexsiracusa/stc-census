// Helper function to escape CSV values.
export const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) {
        return '';
    }
    // If the value is an object or array, return its JSON representation.
    if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
    }
    return `"${String(value).replace(/"/g, '""')}"`;
};

// Function that converts project JSON data into a formatted CSV string with sections.
export const convertProjectDataToCSV = (data: any): string => {
    let csv = '';

    // ------ 1. Project Data Section ------------
    csv += 'Project Data\n';
    const projectFields = [
        'id',
        'parent',
        'name',
        'description',
        'status',
        'budget',
        'created_at',
        'requested_by',
        'date_requested',
        'actual_start_date',
        'actual_completion_date',
        'target_start_date',
        'target_completion_date',
        'archived',
    ];
    // Header row for project data.
    csv += projectFields.join(',') + '\n';
    const projectRow = projectFields.map((field) => escapeCSV(data[field])).join(',');
    csv += projectRow + '\n\n';

    // ------ 2. Tasks Section ------------
    if (data.tasks && Array.isArray(data.tasks) && data.tasks.length > 0) {
        csv += 'Tasks\n';
        // Use keys from the first task as headers.
        const taskFields = Object.keys(data.tasks[0]);
        csv += taskFields.join(',') + '\n';
        data.tasks.forEach((task: any) => {
            const row = taskFields.map((field) => escapeCSV(task[field])).join(',');
            csv += row + '\n';
        });
        csv += '\n';
    }

    // ------ 3. Sub Projects Section ------------
    if (data.sub_projects && Array.isArray(data.sub_projects) && data.sub_projects.length > 0) {
        csv += 'Sub Projects\n';
        const subProjectFields = Object.keys(data.sub_projects[0]);
        csv += subProjectFields.join(',') + '\n';
        data.sub_projects.forEach((subProject: any) => {
            const row = subProjectFields.map((field) => escapeCSV(subProject[field])).join(',');
            csv += row + '\n';
        });
        csv += '\n';
    }

    // ------ 4. Path Section ------------
    if (data.path && Array.isArray(data.path) && data.path.length > 0) {
        csv += 'Path\n';
        const pathFields = Object.keys(data.path[0]);
        csv += pathFields.join(',') + '\n';
        data.path.forEach((segment: any) => {
            const row = pathFields.map((field) => escapeCSV(segment[field])).join(',');
            csv += row + '\n';
        });
        csv += '\n';
    }

    // ------ 5. Status Counts Section ------------
    if (data.status_counts && typeof data.status_counts === 'object') {
        csv += 'Status Counts\n';
        csv += 'Status,Count\n';
        Object.keys(data.status_counts).forEach((statusKey) => {
            csv += `${escapeCSV(statusKey)},${escapeCSV(data.status_counts[statusKey])}\n`;
        });
        csv += '\n';
    }

    return csv;
};
