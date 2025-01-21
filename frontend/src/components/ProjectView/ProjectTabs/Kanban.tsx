import TabProps from "./TabProps.ts";

const Kanban = (props: TabProps) => {
    return (
        <div>Kanban {props.project['id']}</div>
    )
};

export default Kanban;