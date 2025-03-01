import {useTranslation} from 'react-i18next';
import Graph from "../Graph/Graph.tsx";
import {getCostChartOptions} from "./costChartConfig.ts";
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

interface CostChartProps {
    evmData: any;
}

const CostChart = ({evmData}: CostChartProps) => {
    const {t} = useTranslation();

    // Cost-related arrays
    const plannedValue = evmData.planned_value || [];
    const earnedValue = evmData.earned_value || [];
    const actualCost = evmData.actual_cost || [];

    // Get dates from the planned value (used for the cost chart)
    const dates = plannedValue.map((pair: [string, number]) => pair[0]);

    // Latest date from EVM metrics; used as cutoff for "done" entries
    const actualDate = evmData.metadata.today;

    // Determine if the vertical line should be displayed
    const determineVerticalLineVisibility = (actualDate: string, dates: string[]) => {
        if (!dates.length || !actualDate) {
            return {show: false};
        }

        // Convert dates to Date objects for comparison
        const firstDate = new Date(dates[0]);
        const lastDate = new Date(dates[dates.length - 1]);
        const actualDateObj = new Date(actualDate);

        if (actualDateObj < firstDate || actualDateObj > lastDate) {
            return {show: false};
        }

        // Otherwise, show the line at the actual date
        return {show: true, date: actualDate};
    };


    const lineVisibility = determineVerticalLineVisibility(actualDate, dates);

    // Filter out earned and actual cost values up to the actualDate
    const earnedCosts = earnedValue.map((pair: [string, number]) => {
        const dateObj = new Date(pair[0]);
        const actualDateObj = new Date(actualDate);
        return dateObj <= actualDateObj ? pair[1] : null;
    });

    const actualCosts = actualCost.map((pair: [string, number]) => {
        const dateObj = new Date(pair[0]);
        const actualDateObj = new Date(actualDate);
        return dateObj <= actualDateObj ? pair[1] : null;
    });

    const plannedCosts = plannedValue.map((pair: [string, number]) => pair[1]);

    // Build annotations for the cost chart.
    // Only show the vertical line if actual date is within the chart date range
    const annotations: any = lineVisibility.show ? {
        verticalLine: {
            type: 'line',
            scaleID: 'x',
            value: lineVisibility.date,
            borderColor: 'grey',
            borderWidth: 2,
            borderDash: [10, 5],
            label: {
                enabled: true,
                content: t('Actual Time'),
                position: 'start'
            }
        }
    } : {};

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

    return (
        <Graph data={costChartData} options={costOptions}/>
    );
};

export default CostChart;
