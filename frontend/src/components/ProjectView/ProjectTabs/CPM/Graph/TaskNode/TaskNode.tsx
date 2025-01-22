import './TaskNode.css';
import '@xyflow/react/dist/style.css';

import { Handle, Position } from '@xyflow/react';

const TaskNode = ({ data }) => {
    return (
        <div className="task-node">
            <Handle
                type="target"
                position={Position.Left}
                id={`target-${data.id}`}
                className="handle handle-target"
            />

            <div className="task-content">{data.name}</div>

            <Handle
                type="source"
                position={Position.Right}
                id={`source-${data.id}`}
                className="handle handle-source"
            />
        </div>
    );
};

export default TaskNode;
