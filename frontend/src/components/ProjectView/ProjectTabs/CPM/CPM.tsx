// CPM.tsx
import TabProps from "../TabProps.ts";
import { useState, useEffect } from 'react';
import { ReactFlow, useNodesState, useEdgesState } from 'reactflow';
import TaskNode from './TaskNode';

interface Task {
    id: number;
    parent: number;
    name: string;
    description: null | string;
    status: string;
    created_at: string;
    start_date: null | string;
    completion_date: null | string;
    target_start_date: null | string;
    target_completion_date: null | string;
    target_days_to_complete: null | number;
    actual_cost: null | number;
    expected_cost: null | number;
    depends_on: number[];
}

// Define nodeTypes outside the component
const nodeTypes = {
    task: TaskNode,
};

const CPM = (props: TabProps) => {
    const [tasks, setTasks] = useState<Task[] | null>(null);
    const host = import.meta.env.VITE_BACKEND_HOST;

    useEffect(() => {
        fetch(`${host}/project/${props.project['id']}/all-tasks`)
            .then(response => response.json())
            .then(json => {
                setTasks(json)
            })
            .catch(error => console.error(error));
    }, []);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (tasks) {
            const newNodes = tasks.map((task, index) => ({
                id: `node-${task.id}`,
                type: 'task',
                position: [Math.random() * 500, Math.random() * 500],
                data: task,
            }));

            const newEdges = tasks.reduce((acc, task) => {
                task.depends_on.forEach(dependency => {
                    const dependencyTask = tasks.find(t => t.id === dependency);
                    if (dependencyTask) {
                        acc.push({
                            id: `edge-${task.id}-${dependency}`,
                            source: `node-${dependencyTask.id}`,
                            target: `node-${task.id}`,
                        });
                    }
                });
                return acc;
            }, []);

            setNodes(newNodes);
            setEdges(newEdges);
        }
    }, [tasks]);

    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
            />
        </div>
    )
};

export default CPM;
