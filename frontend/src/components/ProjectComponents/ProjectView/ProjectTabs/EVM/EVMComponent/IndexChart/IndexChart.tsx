import { useTranslation } from 'react-i18next';
import Graph from "../Graph.tsx";
import { getIndexChartOptions } from "./indexChartConfig.ts";

interface IndexChartProps {
    evmData: any;
}

const IndexChart = ({ evmData }: IndexChartProps) => {
    const { t } = useTranslation();

    // New index/percentage arrays from the response
    const scheduleVarianceArray = evmData.schedule_variance_percent_in_decimal || [];
    const costPerformanceArray = evmData.cost_performance_index || [];
    const timeVarianceArray = evmData.time_variance_percent_in_decimal || [];

    // Prepare data for the index chart.
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
        <div className="chart-container">
            <Graph data={indexChartData} options={indexOptions} />
        </div>
    );
};

export default IndexChart;
