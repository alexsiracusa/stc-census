import './EVM.css'

import TabProps from "../TabProps.ts";

const EVM = (props: TabProps) => {
    return (
        <div>EVM {props.project['id']}</div>
    )
};

export default EVM;