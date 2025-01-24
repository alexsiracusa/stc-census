import TabProps from "../TabProps";
import { useTasksFetcher } from './hooks/useTasksFetcher.ts';
import TaskGraph from './TaskGraph';

const CPM = (props: TabProps) => {
    // Load task data
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
