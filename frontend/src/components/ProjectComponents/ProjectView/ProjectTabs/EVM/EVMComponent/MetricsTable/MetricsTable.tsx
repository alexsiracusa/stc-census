import { useTranslation } from 'react-i18next';

interface MetricsTableProps {
    evmData: any;
}

// Custom mapping of keys to display names
const metricDisplayNames: Record<string, string> = {
    actual_time: 'Actual Time (AT)',
    total_actual_cost: 'Total Actual Cost',
    date_of_latest_done_task: 'Date of Last Done Task',
    budget_at_completion: 'Budget At Completion (BAC)',
    schedule_variance_percent_in_decimal: 'Schedule Variance (SV)',
    cost_performance_index: 'Cost Performance Index (CPI)',
    time_variance_percent_in_decimal: 'Time Variance (TV)',
};

// Custom formatting for the metrics
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
        `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    schedule_variance_percent_in_decimal: (val: number) =>
        `${val}`,
    cost_performance_index: (val: number) => val.toFixed(2),
    time_variance_percent_in_decimal: (val: number) =>
        `${val}`,
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

    // Get the last entry from each list and extract the number (second element)
    const lastScheduleVariancePercent = evmData.schedule_variance_percent_in_decimal?.length > 0
        ? evmData.schedule_variance_percent_in_decimal[evmData.schedule_variance_percent_in_decimal.length - 1][1]
        : 'N/A';

    const lastCostPerformanceIndex = evmData.cost_performance_index?.length > 0
        ? evmData.cost_performance_index[evmData.cost_performance_index.length - 1][1]
        : 'N/A';

    const lastTimeVariancePercent = evmData.time_variance_percent_in_decimal?.length > 0
        ? evmData.time_variance_percent_in_decimal[evmData.time_variance_percent_in_decimal.length - 1][1]
        : 'N/A';

    // Add the last entries to the otherMetrics object
    otherMetrics.schedule_variance_percent_in_decimal = lastScheduleVariancePercent;
    otherMetrics.cost_performance_index = lastCostPerformanceIndex;
    otherMetrics.time_variance_percent_in_decimal = lastTimeVariancePercent;

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
