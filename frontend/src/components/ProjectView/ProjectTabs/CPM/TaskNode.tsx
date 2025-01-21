// TaskNode.tsx
import { Handle, Position } from 'reactflow';
import './TaskNode.css'; // Add this import

const TaskNode = ({ data }) => {
    return (
        <div className="task-node">
            <Handle
                type="target"
                position={Position.Top}
                id={`target-${data.id}`}
                className="handle handle-target"
            />

            <div className="task-content">{data.name}</div>

            <Handle
                type="source"
                position={Position.Bottom}
                id={`source-${data.id}`}
                className="handle handle-source"
            />
        </div>
    );
};

export default TaskNode;
