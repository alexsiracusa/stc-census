import TabProps from "./TabProps.ts";

const GanttChart = (props: TabProps) => {
    return (
        <div>GanttChart {props.project['id']}</div>
    )
};

export default GanttChart;