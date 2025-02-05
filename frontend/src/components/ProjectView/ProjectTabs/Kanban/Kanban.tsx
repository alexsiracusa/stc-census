import './Kanban.css'
import {useTranslation} from 'react-i18next';

import TabProps from "../TabProps.ts";
import {DragDropContext, Droppable} from "@hello-pangea/dnd";

import TaskCard from './TaskCard/TaskCard.tsx';
import {useSelector} from "react-redux";
import useUpdateTask from "../../../../hooks/useUpdateTask.ts";

const Kanban = (props: TabProps) => {
    const tasks = useSelector((state) => state.projects.byId[props.project_id].byId);
    const {updateTask, loading, error, data} = useUpdateTask();
    const {t} = useTranslation();

    const statuses = [
        {
            'name': 'to_do',
            'display_name': t('kanban.toDo', 'To Do'),
            'tasks': Object.values(tasks).filter((task) => task.status === 'to_do')
        },
        {
            'name': 'in_progress',
            'display_name': t('kanban.inProgress', 'To Do'),
            'tasks': Object.values(tasks).filter((task) => task.status === 'in_progress')
        },
        {
            'name': 'done',
            'display_name': t('kanban.done', 'To Do'),
            'tasks': Object.values(tasks).filter((task) => task.status === 'done')
        },
        {
            'name': 'on_hold',
            'display_name': t('kanban.onHold', 'To Do'),
            'tasks': Object.values(tasks).filter((task) => task.status === 'on_hold')
        }
    ];

    const index_map = {
        'to_do': 0,
        'in_progress': 1,
        'done': 2,
        'on_hold': 3
    };

    function onDragEnd(result: any): void { // eslint-disable-line
        const {source, destination} = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        const source_list = statuses[index_map[source.droppableId]];
        const destination_list = statuses[index_map[destination.droppableId]];

        const [removed] = source_list.tasks.splice(source.index, 1);
        destination_list.tasks.splice(destination.index, 0, removed);
        updateTask(removed.project_id, removed.id, {status: destination.droppableId})
    }

    return (
        <div className="kanban">
            <h2>{t('kanban.title')}</h2>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-board">
                    {statuses.map((status) => (
                        <div key={status.name} className="kanban-column">
                            <div className="column-header">
                                <h3>{status.display_name.toUpperCase()}</h3>
                            </div>

                            <Droppable
                                droppableId={status.name}
                                direction="vertical"
                            >
                                {provided => (
                                    <div
                                        className="task-container"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {status.tasks?.map((task, index) => (
                                            <TaskCard
                                                key={index}
                                                task={task}
                                                index={index}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    )
        ;
};

export default Kanban;