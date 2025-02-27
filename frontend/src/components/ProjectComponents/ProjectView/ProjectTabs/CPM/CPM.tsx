import './CPM.css';
import TabProps from "../TabProps";
import CPMComponent from './CPMComponent';

const CPM = (props: TabProps) => {
    return (
        <div className="cpm">
            <CPMComponent {...props} />
        </div>
    );
};

export default CPM;
