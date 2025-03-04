import './SummaryInfo.css';

import { useSelector } from "react-redux";
import useFetchProjectSummary from "../../../../../../hooks/useFetchProjectSummary.ts";

interface CPMComponentProps {
    project_id: number;
}

const SummaryInfo = (props: CPMComponentProps) => {

    const { loading: loading, error: error } = useFetchProjectSummary(props.project_id);
    const project = useSelector((state: any) => state.projects.byId[props.project_id]);
    if (loading) {
        return <div className="summary-info">Loading summary data...</div>;
    }

    if (error) {
        // with error message
        return <div className="summary-info">Error loading summary data
            <div className="error-message">{error.toString()}</div>
        </div>;
    }

    return (
        <div className="summary-info">
            {JSON.stringify(project)}
        </div>
    );
};

export default SummaryInfo;
