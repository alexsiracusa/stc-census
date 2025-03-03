import './GanttBody.css'

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
import {Bar} from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "chartjs-adapter-date-fns";

import {findStartAndEndDates} from "../hooks/findStartAndEndDates.tsx";
import {formatDateInLocal} from "../utils/formattedDate.ts";
import formatGanttData from "../utils/formatGanttData.tsx";
import {useEffect, useRef} from "react";

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

const TASK_ROW_HEIGHT = 45; // Fixed height for each task row

interface TaskSchedule {
    start: string;
    end: string;
}

interface GanttBodyProps {
    data: TaskSchedule[];
    dateRange?: { startDate: string; endDate: string } | null;
}

const GanttBody = ({data, dateRange}: GanttBodyProps) => {
    const chartRef = useRef<any>(null);

    if (!data) {
        throw new Error("GanttBody: data is null or undefined");
    }

    const {startDate, endDate} = findStartAndEndDates(data);

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
            const {ctx, data, chartArea: {top, bottom, left, right}, scales: {x, y}} = chart;

            ctx.save();

            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'rgba(102, 102, 102, 1)';
            ctx.setLineDash([6, 6]);
            ctx.moveTo(x.getPixelForValue(new Date()), top);
            ctx.lineTo(x.getPixelForValue(new Date()), bottom);
            ctx.stroke();
            ctx.restore();

            ctx.setLineDash([]);

            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(102, 102, 102, 1)';
            ctx.fillStyle = 'rgba(102, 102, 102, 1)';
            ctx.moveTo(x.getPixelForValue(new Date()), top + 3);
            ctx.lineTo(x.getPixelForValue(new Date()) - 6, top - 6);
            ctx.lineTo(x.getPixelForValue(new Date()) + 6, top - 6);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.restore();

            ctx.font = 'bold 12px sans-serif';
            ctx.fillStyle = 'rgba(102, 102, 102, 1)';
            ctx.textAlign = 'center';
            ctx.fillText('Today', x.getPixelForValue(new Date()), bottom + 20);
            ctx.restore();
        }
    }

    const baseOptions: ChartOptions<"bar"> = {
        indexAxis: "y",
        resizeDelay: 20,
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 10,
                right: 40,
                left: 40,
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
                min: dateRange ? dateRange.startDate : startDate,
                max: dateRange ? dateRange.endDate : endDate,
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
                        // offset: 15,
                        padding: {top: 8},
                        font: {size: 12, weight: 400, lineHeight: 1.7},
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
    } as ChartOptions<"bar">;

    useEffect(() => {
        if (chartRef.current && dateRange) {
            const chart = chartRef.current;
            chart.config.options.scales.x.min = dateRange.startDate;
            chart.config.options.scales.x.max = dateRange.endDate;
            chart.update();
        }
    }, [dateRange]);

    return (
        <div style={{height: `${chartHeight}px`}}>
            <Bar data={formattedData} options={baseOptions} plugins={[todayLine]}/>
        </div>
    );
}

export default GanttBody;