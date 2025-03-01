import './EVMComponent.css';

import {useSelector} from "react-redux";
import useFetchEVM from "../../../../../../hooks/useFetchEVM.ts";
import CostChart from './CostChart/CostChart.tsx';
import IndexChart from './IndexChart/IndexChart.tsx';
import MetricsTable from './MetricsTable/MetricsTable.tsx';

interface EVMComponentProps {
    project_id: number;
    direction?: 'row' | 'column'
}

const EVMComponent = (props: EVMComponentProps) => {
    const {loading: evmLoading, error: evmError} = useFetchEVM(props.project_id);
    const projectEvmData = useSelector((state: any) => state.projects.byId[props.project_id]);

    if (evmLoading) {
        return <div className="evm-component">Loading EVM data...</div>;
    }

    if (evmError) {
        return (
            <div className="evm-component">
                Error loading EVM data
                <div className="error-message">{evmError.toString()}</div>
            </div>
        );
    }

    if (!projectEvmData || !projectEvmData.evm) {
        return <div className="evm-component">No EVM data available.</div>;
    }

    const evmData = projectEvmData.evm;

    return (
        <div className={`evm-component ${props.direction ?? 'column'}`}>
            <div className="chart-container">
                <CostChart evmData={evmData}/>
            </div>
            <div className="chart-container">
                <IndexChart evmData={evmData}/>
            </div>
            <div className="table-container">
                <MetricsTable evmData={evmData}/>
            </div>
        </div>
    );
};

export default EVMComponent;
