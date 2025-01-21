// TaskNode.tsx
import { Handle, Position } from 'reactflow';

const TaskNode = ({ data }) => {
    return (
        <div className="task-node">
            {/* Input handle - where edges can connect TO this node */}
            <Handle
                type="target"
                position={Position.Top}
                id={`target-${data.id}`}
                style={{ background: '#555' }}
            />

            {/* Your node content */}
            <div>{data.name}</div>

            {/* Output handle - where edges can connect FROM this node */}
            <Handle
                type="source"
                position={Position.Bottom}
                id={`source-${data.id}`}
                style={{ background: '#555' }}
            />
        </div>
    );
};

export default TaskNode;
