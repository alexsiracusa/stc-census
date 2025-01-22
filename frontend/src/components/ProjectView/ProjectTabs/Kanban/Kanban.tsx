import './Kanban.css'
import { useTranslation } from 'react-i18next';

import TabProps from "../TabProps.ts";
import AddTask from "./AddTask.tsx";

import KanbanTask from './KanbanTask.tsx';

const Kanban = (props: TabProps) => {
    const { t } = useTranslation();
    const project = props.project;

    const groupedTasks = project.tasks.reduce((acc, task) => {
        const status = task.status || 'not_started';
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(task);
        return acc;
    }, {});

    const statuses = ["not_started", "in_progress", "finished", "1", "2"];

    return (
        <div>
            <h1>{t('kanban.title')} {props.project['id']}</h1>

            <AddTask />

            {project['tasks'].length > 0 && (
                <div className="kanban-board">
                    {statuses.map((status) => (
                        <div key={status} className="kanban-column">
                            <div className="column-header">
                                <h3>{status}</h3>
                            </div>
                            <div className="tasks-container">
                                {groupedTasks[status]?.map((task) => (
                                    <KanbanTask key={task.id} task={task} />
                                )) || <p>No tasks</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Kanban;