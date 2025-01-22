import './CPM.css';
import '@xyflow/react/dist/style.css';

import TabProps from "../TabProps";
import { ReactFlow } from '@xyflow/react';
import TaskNode from './Graph/TaskNode/TaskNode.tsx';
import { useTasksFetcher } from './Data/useTasksFetcher.ts';
import { useGraphProcessor } from './Graph/processDataIntoGraph.ts';

const nodeTypes = {
    task: TaskNode,
};

const CPM = (props: TabProps) => {
    const { tasks } = useTasksFetcher(props.project.id);
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange
    } = useGraphProcessor(tasks);

    return (
        <div className='cpm'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                className='cpm-flow'
            />
        </div>
    )
};

export default CPM;
