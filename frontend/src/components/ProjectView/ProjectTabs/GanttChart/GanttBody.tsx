import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    TooltipPositionerMap,
    ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chartjs-adapter-date-fns";

import { findStartAndEndDates } from "./hooks/findStartAndEndDates";
import { formatDateInLocal } from "./utils/formattedDate";
import formatGanttData from "./utils/formatGanttData";
import { Task } from "../../../../types/Task";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels,
    TimeScale
);

// To track cursor position
interface CustomTooltip extends TooltipPositionerMap {
    custom: (
        elements: unknown,
        eventPosition: { x: string; y: string }
    ) => { x: string; y: string };
}

(Tooltip.positioners as CustomTooltip).custom = (
    _elements: unknown,
    eventPosition: { x: string; y: string }
) => {
    return {
        x: eventPosition.x,
        y: eventPosition.y,
    };
};

const TASK_ROW_HEIGHT = 70; // Fixed height for each task row
const CHART_CONTAINER_HEIGHT = 690; // Fixed height for the chart container

const TIME_UNIT_WIDTH = 50; // Fixed width for each time unit
const CHART_CONTAINER_WIDTH = 1000; // Fixed width for the chart container

const GanttBody = ({ data }: { data: Task[] }) => {
    if (!data) {
        throw new Error("GanttBody: data is null or undefined");
    }

    const { startDate, endDate } = findStartAndEndDates(data);

    if (!startDate || !endDate) {
        throw new Error(
            "GanttBody: startDate or endDate is null or undefined"
        );
    }

    const formattedData = formatGanttData(data);

    if (!formattedData || !formattedData.datasets || !formattedData.labels) {
        throw new Error(
            "GanttBody: formattedData is null or undefined or does not contain the required properties"
        );
    }

    const chartHeight = data.length * TASK_ROW_HEIGHT + 100;

    const timeRangeInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    // const chartWidth = timeRangeInDays * TIME_UNIT_WIDTH;

    let chartWidth
    if (timeRangeInDays < 20) {
        chartWidth = 1000;
    } else if (timeRangeInDays <= 30) {
        chartWidth = timeRangeInDays * TIME_UNIT_WIDTH;
    } else {
        chartWidth = 1000;
    }

    let timeUnit: "day" | "week" | "month";
    if (timeRangeInDays <= 30) {
        timeUnit = "day"; // Use days for short ranges
    } else if (timeRangeInDays <= 90) {
        timeUnit = "week"; // Use weeks for medium ranges
    } else {
        timeUnit = "month"; // Use months for long ranges
    }

    const todayLine = {
        id: 'todayLine',
        afterDatasetsDraw(chart, args, pluginOptions) {
            const { ctx, data, chartArea: { top, bottom, left, right }, scales: { x, y
            } } = chart;

            ctx.save();

            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(255, 26, 104, 1)';
            ctx.setLineDash([6, 6]);
            ctx.moveTo(x.getPixelForValue(new Date()), top);
            ctx.lineTo(x.getPixelForValue(new Date()), bottom);
            ctx.stroke();

            ctx.setLineDash([]);
        }
    }

    const baseOptions: ChartOptions<"bar"> = {
        indexAxis: "y",
        resizeDelay: 20,
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 30,
                right: 40,
                bottom: 40,
            },
        },
        scales: {
            x: {
                position: "top",
                type: "time",
                time: {
                    unit: timeUnit,
                },
                min: startDate,
                max: endDate,
                stacked: true,
                offset: false,
            },
            y: {
                stacked: true,
                display: false,
            },
        },

        plugins: {
            tooltip: {
                callbacks: {
                    label(tooltipItem) {
                        const label = tooltipItem.label;
                        if (!label) {
                            throw new Error(
                                "GanttBody: tooltipItem.label is null or undefined"
                            );
                        }
                        return label;
                    },
                    title(tooltipItems) {
                        const event = (tooltipItems[0].raw as {
                            EventName: string;
                        }).EventName;

                        if (!event) {
                            throw new Error(
                                "GanttBody: tooltipItem.raw.EventName is null or undefined"
                            );
                        }

                        const startDate = new Date(
                            (tooltipItems[0].raw as { x: string[] }).x[0]
                        );

                        if (isNaN(startDate.getTime())) {
                            throw new Error(
                                "GanttBody: tooltipItem.raw.x[0] is not a valid date"
                            );
                        }

                        const endDate = new Date(
                            (tooltipItems[0].raw as { x: string[] }).x[1]
                        );

                        if (isNaN(endDate.getTime())) {
                            throw new Error(
                                "GanttBody: tooltipItem.raw.x[1] is not a valid date"
                            );
                        }

                        return [
                            event,
                            `From: ${formatDateInLocal(startDate)} - To: ${formatDateInLocal(
                                endDate
                            )}`,
                        ];
                    },
                },
                position: "custom" as "average",
            },
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            datalabels: {
                display: true,
                labels: {
                    index: {
                        color: "#1c1c1c",
                        align: "bottom",
                        anchor: "center",
                        offset: 15,
                        padding: { top: 10 },
                        font: { size: 12, weight: 400, lineHeight: 1.7 },
                        formatter(value: { EventName: string; x: string[] }) {
                            if (!value.EventName) {
                                throw new Error(
                                    "GanttBody: value is null or undefined or does not contain the required properties"
                                );
                            }

                            return (
                                value.EventName
                            );
                        },
                    },
                },
            },
        },
    };

    return (
        <div style={{ height: `${CHART_CONTAINER_HEIGHT}px`, width: `${CHART_CONTAINER_WIDTH}px`, overflow: 'auto' }}>
            <div style={{ height: `${chartHeight}px`, width: `${chartWidth}px` }}>
                <h4>Timeline</h4>
                <Bar data={formattedData} options={baseOptions} plugins={[todayLine]} />
            </div>
        </div>
    );
}

export default GanttBody;