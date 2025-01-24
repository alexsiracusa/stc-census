import './TaskNode.css';
import '@xyflow/react/dist/style.css';

import { Handle, Position } from '@xyflow/react';
import { Task } from './../../Data/Task.tsx';

const TaskNode = ({ data }: {data:Task}) => {
    return (
        <div className={`task-node status-${data.status}`}>
            <Handle
                type="target"
                position={Position.Left}
                id={`target-${data.id}`}
                className="handle handle-target"
            />

            <div className="task-content">{ data.name }</div>

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
