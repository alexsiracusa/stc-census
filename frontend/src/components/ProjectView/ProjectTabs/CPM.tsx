import TabProps from "./TabProps.ts";

const CPM = (props: TabProps) => {
    return (
        <div>CPM {props.project['id']}</div>
    )
};

export default CPM;