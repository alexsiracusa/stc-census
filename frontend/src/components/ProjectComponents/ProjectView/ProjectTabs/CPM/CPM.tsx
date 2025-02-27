import './CPM.css';
import TabProps from "../TabProps";
import CPMComponent from './CPMComponent/CPMComponent.tsx';

const CPM = (props: TabProps) => {
    return (
        <div className="cpm">
            <CPMComponent {...props} />
        </div>
    );
};

export default CPM;
