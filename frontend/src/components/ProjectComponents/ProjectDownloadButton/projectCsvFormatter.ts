export const convertProjectDataToCSV = (data: any): string => {
    const processProject = (project: any): string[][] => {
        const rows: string[][] = [];
        // Project name row
        rows.push([project.name]);

        // Helper function to safely convert values to strings
        const safeString = (value: any): string => {
            if (value === null || value === undefined) return '';
            if (typeof value === 'object') return JSON.stringify(value);
            return String(value);
        };

        // Metadata rows
        const metadataRows: string[][] = [
            ['ID', safeString(project.id)],
            ['Status', safeString(project.status)],
            ['Archived', safeString(project.archived)],
            ['Created At', safeString(project.created_at)],
            ['Budget', safeString(project.budget)],
            ['Parent Project ID', safeString(project.parent)],
            ['Actual Cost', safeString(project.actual_cost)],
            ['Expected Cost', safeString(project.expected_cost)],
            ['Budget Variance', safeString(project.budget_variance)],
            ['Description', safeString(project.description)],
            ['Requested By', safeString(project.requested_by)],
            ['Date Requested', safeString(project.date_requested)],
            ['Team Email Alias', safeString(project.team_email_alias)],
            ['Actual Start Date', safeString(project.actual_start_date)],
            ['Target Start Date', safeString(project.target_start_date)],
            ['Person In Charge ID', safeString(project.person_in_charge_id)],
            ['Actual Completion Date', safeString(project.actual_completion_date)],
            ['Target Completion Date', safeString(project.target_completion_date)],
        ];

        // Handle path
        const pathString = project.path?.map((p: any) => p.name).join(' > ') || '';
        metadataRows.push(['Path', safeString(pathString)]);

        // Handle status counts
        if (project.status_counts) {
            Object.entries(project.status_counts).forEach(([status, count]) => {
                metadataRows.push([`Status Count (${status})`, safeString(count)]);
            });
        }

        rows.push(...metadataRows);

        // Tasks section
        if (project.tasks?.length > 0) {
            rows.push([]); // Empty row before task headers

            // Task headers
            const taskHeaders = [
                'Task ID',
                'Task Name',
                'Status',
                'Created At',
                'Actual Cost',
                'Expected Cost',
                'Budget Variance',
                'Person In Charge',
                'Actual Start Date',
                'Target Start Date',
                'Person In Charge ID',
                'Actual Completion Date',
                'Target Completion Date',
                'Target Days to Complete',
                'Depends On',
                'Description',
            ];
            rows.push(taskHeaders);

            // Task rows
            project.tasks.forEach((task: any) => {
                const personInCharge = task.person_in_charge
                    ? `${task.person_in_charge.first_name} ${task.person_in_charge.last_name} (${task.person_in_charge.email})`
                    : '';
                const dependsOn = task.depends_on?.map((d: any) => d.task_id).join(', ') || '';

                const taskRow = [
                    task.id,
                    task.name,
                    task.status,
                    task.created_at,
                    task.actual_cost,
                    task.expected_cost,
                    task.budget_variance,
                    personInCharge,
                    task.actual_start_date,
                    task.target_start_date,
                    task.person_in_charge_id,
                    task.actual_completion_date,
                    task.target_completion_date,
                    task.target_days_to_complete,
                    dependsOn,
                    task.description,
                ].map(field => safeString(field));

                rows.push(taskRow);
            });
        }

        return rows;
    };

    const mainProject = data.result.project;
    const descendants = data.result.descendants || [];

    const csvRows: string[][] = [];
    csvRows.push(...processProject(mainProject));

    descendants.forEach((descendant: any) => {
        csvRows.push([], []); // Two empty rows
        csvRows.push(...processProject(descendant));
    });

    // Convert to CSV string with proper escaping
    const csvContent = csvRows.map(row =>
        row.map(field => {
            const str = field === null || field === undefined ? '' : field;
            return `"${String(str).replace(/"/g, '""')}"`;
        }).join(',')
    ).join('\n');

    return csvContent;
};

export const downloadCSV = (csvContent: string, filename: string): void => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
