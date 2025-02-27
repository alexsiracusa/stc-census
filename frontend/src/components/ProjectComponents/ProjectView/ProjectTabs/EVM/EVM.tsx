import './EVM.css';
import { useTranslation } from 'react-i18next';
import TabProps from "../TabProps";
import { useSelector } from "react-redux";
import Graph from "./utils/Graph.tsx";
import { getCostChartOptions } from "./utils/costChartConfig.ts";
import { getIndexChartOptions } from "./utils/indexChartConfig.ts";
import useFetchEVM from "../../../../../hooks/useFetchEVM.ts";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin
);

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

const EVM = (props: TabProps) => {
    const { t } = useTranslation();
    const projectId = Number(props.project_id);
    const { loading: evmLoading, error: evmError } = useFetchEVM(projectId);
    const projectEvmData = useSelector((state: any) => state.projects.byId[projectId]);

    if (evmLoading) {
        return <div className="evm">Loading EVM data...</div>;
    }

    if (evmError) {
        return <div className="evm">
            Error loading EVM data
            <div className="error-message">{evmError.toString()}</div>
        </div>;
    }

    if (!projectEvmData || !projectEvmData.evm) {
        return <div className="evm">No EVM data available.</div>;
    }

    const evmData = projectEvmData.evm;

    // Cost-related arrays
    const plannedValue = evmData.planned_value || [];
    const earnedValue = evmData.earned_value || [];
    const actualCost = evmData.actual_cost || [];

    // New index/percentage arrays from the response
    const scheduleVarianceArray = evmData.schedule_variance_percent_in_decimal || [];
    const costPerformanceArray = evmData.cost_performance_index || [];
    const timeVarianceArray = evmData.time_variance_percent_in_decimal || [];

    // Get dates from the planned value (used for the cost chart)
    const dates = plannedValue.map((pair: [string, number]) => pair[0]);

    // Latest date from EVM metrics; used as cutoff for "done" entries
    const actualDate = evmData.metrics.date_of_latest_done_task || '';

    // Remove index metrics from the table. (Assuming
    // the remaining metrics in evmData.metrics should be shown.)
    const {
        schedule_variance_percent,
        cost_performance_index,
        time_variance_percent,
        ...otherMetrics
    } = evmData.metrics;

    // Filter out earned and actual cost values up to the actualDate
    const earnedCosts = earnedValue.map((pair: [string, number]) =>
        pair[0] <= actualDate ? pair[1] : null
    );
    const actualCosts = actualCost.map((pair: [string, number]) =>
        pair[0] <= actualDate ? pair[1] : null
    );
    const plannedCosts = plannedValue.map((pair: [string, number]) => pair[1]);

    // Determine vertical line date for annotations
    let verticalLineDate = actualDate;
    if (dates.length) {
        verticalLineDate = actualDate < dates[0]
            ? dates[0]
            : actualDate > dates[dates.length - 1]
                ? dates[dates.length - 1]
                : actualDate;
    }

    // Build annotations for the cost chart.
    // Only the vertical line for "Actual Time" is retained.
    const annotations: any = {
        verticalLine: {
            type: 'line',
            scaleID: 'x',
            value: verticalLineDate,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [10, 5],
            label: {
                enabled: true,
                content: t('Actual Time'),
                position: 'start'
            }
        }
    };

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

    // Data for the cost chart (Planned, Earned, and Actual Cost)
    const costChartData = {
        labels: dates,
        datasets: [
            {
                label: t('Planned Value'),
                data: plannedCosts,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.0
            },
            {
                label: t('Earned Value'),
                data: earnedCosts,
                borderColor: 'rgba(255,99,132,1)',
                tension: 0.0
            },
            {
                label: t('Actual Cost'),
                data: actualCosts,
                borderColor: 'rgba(54, 162, 235, 1)',
                tension: 0.0
            }
        ]
    };

    const costOptions = getCostChartOptions(t, annotations);

    // Prepare data for the new index chart.
    // It is assumed the index arrays share identical date labels.
    const indexDates = scheduleVarianceArray.map((pair: [string, number]) => pair[0]);
    const scheduleVarianceValues = scheduleVarianceArray.map((pair: [string, number]) => pair[1]);
    const costPerformanceValues = costPerformanceArray.map((pair: [string, number]) => pair[1]);
    const timeVarianceValues = timeVarianceArray.map((pair: [string, number]) => pair[1]);

    const indexChartData = {
        labels: indexDates,
        datasets: [
            {
                label: t('Schedule Variance (%)'),
                data: scheduleVarianceValues.map((val: number) => val * 100),
                borderColor: '#FF6B6B',
                tension: 0.0,
                yAxisID: 'left'
            },
            {
                label: t('Time Variance (%)'),
                data: timeVarianceValues.map((val: number) => val * 100),
                borderColor: '#6BFF6B',
                tension: 0.0,
                yAxisID: 'left'
            },
            {
                label: t('Cost Performance Index (%)'),
                // Multiply by 100 so it's on the same percent scale as the others.
                data: costPerformanceValues.map((val: number) => val * 100),
                borderColor: '#4D96FF',
                tension: 0.0,
                yAxisID: 'left'
            }
        ]
    };

    const indexOptions = getIndexChartOptions(t);

    return (
        <div className="evm">
            <Graph data={costChartData} options={costOptions} />
            <Graph data={indexChartData} options={indexOptions} />
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
        </div>
    );
};

export default EVM;
