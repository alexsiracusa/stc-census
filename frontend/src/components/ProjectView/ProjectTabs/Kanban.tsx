import TabProps from "./TabProps.ts";

const Kanban = (props: TabProps) => {
    return (
        <div>Kanban {props.project_id}</div>
    )
};

export default Kanban;