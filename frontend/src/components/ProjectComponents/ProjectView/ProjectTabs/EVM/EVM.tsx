import './EVM.css';

import TabProps from "../TabProps";
import EVMComponent from "./EVMComponent/EVMComponent.tsx";

const EVM = (props: TabProps) => {

    return (
        <div className="evm">
            <EVMComponent project_id={props.project_id} />
        </div>
    );
};

export default EVM;
