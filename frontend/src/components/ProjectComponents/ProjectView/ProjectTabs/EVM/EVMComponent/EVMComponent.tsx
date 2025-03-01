import './EVMComponent.css';
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import useFetchEVM from "../../../../../../hooks/useFetchEVM.ts";
import CostChart from './CostChart/CostChart.tsx';
import IndexChart from './IndexChart/IndexChart.tsx';
import MetricsTable from './MetricsTable/MetricsTable.tsx';

interface EVMComponentProps {
    projectId: number;
}

const EVMComponent = ({ projectId }: EVMComponentProps) => {
    const { t } = useTranslation();
    const { loading: evmLoading, error: evmError } = useFetchEVM(projectId);
    const projectEvmData = useSelector((state: any) => state.projects.byId[projectId]);

    if (evmLoading) {
        return <div className="evm-component">Loading EVM data...</div>;
    }

    if (evmError) {
        return <div className="evm-component">
            Error loading EVM data
            <div className="error-message">{evmError.toString()}</div>
        </div>;
    }

    if (!projectEvmData || !projectEvmData.evm) {
        return <div className="evm-component">No EVM data available.</div>;
    }

    const evmData = projectEvmData.evm;

    return (
        <div className="evm-component">
            <MetricsTable evmData={evmData} />
            <div className="chart-row"> {/* New flex container for charts */}
                <CostChart evmData={evmData} />
                <IndexChart evmData={evmData} />
            </div>
        </div>
    );
};

export default EVMComponent;
