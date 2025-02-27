import './EVM.css';
import TabProps from "../TabProps";
import EVMComponent from "./EVMComponent/EVMComponent.tsx";

const EVM = (props: TabProps) => {
    const projectId = Number(props.project_id);

    return (
        <div className="evm">
            <EVMComponent projectId={projectId} />
        </div>
    );
};

export default EVM;
