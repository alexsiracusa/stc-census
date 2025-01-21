import TabProps from "./TabProps.ts";
import {useState, useEffect} from 'react';

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

    return (
        <div>CPM {props.project['id']}</div>
    )
};

export default CPM;