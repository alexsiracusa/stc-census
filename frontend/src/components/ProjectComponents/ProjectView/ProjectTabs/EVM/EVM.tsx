import './EVM.css';
import { useTranslation } from 'react-i18next';
import TabProps from "../TabProps";
import { useEffect, useState } from "react";
import Graph from "./utils/Graph.tsx";
import { getCostChartOptions } from "./utils/costChartConfig.ts";
import { getIndexChartOptions } from "./utils/indexChartConfig.ts";
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

const useFetchEvmData = (projectId: number): [any, boolean] => {
    const [evmData, setEvmData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const host = import.meta.env.VITE_BACKEND_HOST;

    useEffect(() => {
        setLoading(true);
        fetch(`${host}/project/${projectId}/evm`)
            .then(response => response.json())
            .then(json => {
                setEvmData(json);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, [projectId, host]);

    return [evmData, loading];
};

const EVM = (props: TabProps) => {
    const { t } = useTranslation();
    const projectId = Number(props.project_id);
    const [evmData, evmLoading] = useFetchEvmData(projectId);

    if (evmLoading) {
        return <div className="evm">Loading EVM data...</div>;
    }

    if (!evmData.evm) {
        return <div className="evm">No EVM data available.</div>;
    }

    // Cost-related arrays
    const plannedValue = evmData.evm.planned_value || [];
    const earnedValue = evmData.evm.earned_value || [];
    const actualCost = evmData.evm.actual_cost || [];

    // New index/percentage arrays from the response
    const scheduleVarianceArray = evmData.evm.schedule_variance_percent_in_decimal || [];
    const costPerformanceArray = evmData.evm.cost_performance_index || [];
    const timeVarianceArray = evmData.evm.time_variance_percent_in_decimal || [];

    // Get dates from the planned value (used for the cost chart)
    const dates = plannedValue.map((pair: [string, number]) => pair[0]);

    // Latest date from EVM metrics; used as cutoff for “done” entries
    const actualDate = evmData.evm.metrics.date_of_latest_done_task || '';

    // Remove index metrics from the table.
    // (Assuming the remaining metrics in evmData.evm.metrics should be shown.)
    const { schedule_variance_percent, cost_performance_index, time_variance_percent, ...otherMetrics } = evmData.evm.metrics;

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
        verticalLineDate = actualDate < dates[0] ? dates[0] :
            actualDate > dates[dates.length - 1] ? dates[dates.length - 1] : actualDate;
    }
    const actualIndex = dates.indexOf(verticalLineDate);

    // Build annotations for the cost chart (indicating actual time, SV, and CV)
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

    if (actualIndex !== -1) {
        const pv = plannedCosts[actualIndex];
        const ev = earnedCosts[actualIndex];
        const ac = actualCosts[actualIndex];

        if (typeof pv === 'number' && typeof ev === 'number') {
            const sv = ev - pv;
            annotations.scheduleVarianceLine = {
                type: 'line',
                xMin: verticalLineDate,
                xMax: verticalLineDate,
                yMin: pv,
                yMax: ev,
                borderColor: '#FF6B6B',
                borderWidth: 2,
                borderDash: [5, 5],
            };
            annotations.scheduleVarianceLabel = {
                type: 'label',
                xValue: verticalLineDate,
                yValue: (pv + ev) / 2,
                content: `SV: ${sv.toFixed(2)}`,
                backgroundColor: 'rgba(255,255,255,0.8)',
                color: '#FF6B6B',
                font: { size: 12 },
                padding: 4
            };
        }

        if (typeof ev === 'number' && typeof ac === 'number') {
            const cv = ev - ac;
            annotations.costVarianceLine = {
                type: 'line',
                xMin: verticalLineDate,
                xMax: verticalLineDate,
                yMin: ev,
                yMax: ac,
                borderColor: '#4D96FF',
                borderWidth: 2,
                borderDash: [5, 5],
            };
            annotations.costVarianceLabel = {
                type: 'label',
                xValue: verticalLineDate,
                yValue: (ev + ac) / 2,
                content: `CV: ${cv.toFixed(2)}`,
                backgroundColor: 'rgba(255,255,255,0.8)',
                color: '#4D96FF',
                font: { size: 12 },
                padding: 4
            };
        }
    }

    // Formatting for metric values shown in the table.
    const formatMetricValue = (key: string, value: any) => {
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'number') {
            switch (key) {
                case 'actual_cost_total':
                case 'budget_at_completion':
                    return value.toFixed(2);
                default:
                    return value;
            }
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
                label: t('Cost Performance Index'),
                data: costPerformanceValues,
                borderColor: '#4D96FF',
                tension: 0.0,
                yAxisID: 'right'
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
                            <td>{t(key)}</td>
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
