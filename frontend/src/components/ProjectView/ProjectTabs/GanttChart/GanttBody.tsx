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

    const baseOptions: ChartOptions<"bar"> = {
        indexAxis: "y",
        resizeDelay: 20,
        responsive: true,
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
                    unit: "day",
                },
                min: startDate,
                max: endDate,
                stacked: true,
            },
            y: {
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
                labels: {
                    index: {
                        color: "#1c1c1c",
                        backgroundColor: "rgba(255,255,255, 0.1)",
                        align: "right",
                        anchor: "start",
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
        <div style={{ height: '600px', width: '100%', overflow: 'auto' }}>
            <div style={{ minWidth: '1200px' }}>
                <h4>Timeline</h4>
                <Bar data={formattedData} options={baseOptions} />
            </div>
        </div>
    );
}

export default GanttBody;