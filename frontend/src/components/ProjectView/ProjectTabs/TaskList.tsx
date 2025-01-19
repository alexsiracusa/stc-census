import TabProps from "./TabProps.ts";

const TaskList = (props: TabProps) => {
    return (
        <div>Task List {props.project_id}</div>
    )
};

export default TaskList;