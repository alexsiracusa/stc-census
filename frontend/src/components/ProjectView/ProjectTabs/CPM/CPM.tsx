import './CPM.css'
import TabProps from "../TabProps.ts";
import { ReactFlow } from 'reactflow';
import TaskNode from './TaskNode';
import { useCPMData } from './useCPMData';

const nodeTypes = {
    task: TaskNode,
};

const CPM = (props: TabProps) => {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange
    } = useCPMData(props.project.id);

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
