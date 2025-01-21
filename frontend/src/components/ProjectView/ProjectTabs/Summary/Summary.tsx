import './Summary.css'

import TabProps from "../TabProps.ts";

const Summary = (props: TabProps) => {
    return (
        <div>Summary {props.project['id']}</div>
    )
};

export default Summary;