import './CPM.css'

import TabProps from "../TabProps.ts";
import {useEffect, useState} from 'react';
import {ReactFlow, useEdgesState, useNodesState} from 'reactflow';
import TaskNode from './TaskNode';
import {Task} from "./Task.tsx";

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
                position: { x: 0, y: 0 }, // Default position will be handled by layout
                data: task,
                className: 'cpm-node'
            }));

            const newEdges = tasks.reduce((acc, task) => {
                task.depends_on.forEach(dependency => {
                    const dependencyTask = tasks.find(t => t.id === dependency);
                    if (dependencyTask) {
                        acc.push({
                            id: `edge-${task.id}-${dependency}`,
                            source: `node-${dependencyTask.id}`,
                            target: `node-${task.id}`,
                            className: 'cpm-edge'
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
