import { useTranslation } from 'react-i18next';

interface MetricsTableProps {
    evmData: any;
}

// Custom mapping of keys to display names
const metricDisplayNames: Record<string, string> = {
    actual_time: 'Actual Time',
    total_actual_cost: 'Total Actual Cost',
    date_of_latest_done_task: 'Date of Last Done Task',
    budget_at_completion: 'Budget At Completion (BAC)',
};

// Custom formatting for the four metrics
const customMetricFormatters: Record<string, (val: any) => string> = {
    actual_time: (val: number) => `${val} days`,
    total_actual_cost: (val: number) =>
        `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    date_of_latest_done_task: (val: string) => {
        const date = new Date(val);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    },
    budget_at_completion: (val: number) =>
        `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
};

const MetricsTable = ({ evmData }: MetricsTableProps) => {
    const { t } = useTranslation();

    // Remove index metrics from the table
    const {
        schedule_variance_percent,
        cost_performance_index,
        time_variance_percent,
        ...otherMetrics
    } = evmData.metrics;

    // Formatting for metric values shown in the table.
    const formatMetricValue = (key: string, value: any) => {
        if (value === null || value === undefined) return 'N/A';
        if (customMetricFormatters[key]) {
            return customMetricFormatters[key](value);
        }
        if (typeof value === 'number') {
            // Default for any other number: show it as is.
            return value;
        }
        return value;
    };

    return (
        <div className="table-container">
            <table className="evm-metrics-table">
                <thead>
                <tr>
                    <th>{t('Metric')}</th>
                    <th>{t('Value')}</th>
                </tr>
                </thead>
                <tbody>
                {Object.entries(otherMetrics).map(([key, value]) => (
                    <tr key={key}>
                        {/* Use custom display name if available */}
                        <td>{t(metricDisplayNames[key] || key)}</td>
                        <td>{formatMetricValue(key, value)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MetricsTable;
