import './CPM.css';

import TabProps from "../TabProps";
import { useTasksFetcher } from './Data/useTasksFetcher';
import TaskGraph from './TaskGraph';

const CPM = (props: TabProps) => {
    const { tasks } = useTasksFetcher(props.project.id);

    // Add loading state
    if (!tasks || tasks.length === 0) {
        return <div className="cpm">Loading tasks...</div>;
    }

    return (
        <TaskGraph
            className='cpm'
            tasks={tasks}
        />
    );
};

export default CPM;
