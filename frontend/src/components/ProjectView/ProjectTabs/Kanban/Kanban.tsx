import './Kanban.css'
import {useTranslation} from 'react-i18next';

import TabProps from "../TabProps.ts";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";

import TaskCard from './TaskCard/TaskCard.tsx';

const Kanban = (props: TabProps) => {
    const {t} = useTranslation();
    const project = props.project;

    const groupedTasks = project.tasks.reduce((acc, task) => {
        const status = task.status || 'not_started';
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(task);
        return acc;
    }, {});

    const statuses = [
        {
            'name': 'to_do',
            'display_name': 'To Do'
        },
        {
            'name': 'in_progress',
            'display_name': 'In Progress'
        },
        {
            'name': 'done',
            'display_name': 'Done'
        },
        {
            'name': 'on_hold',
            'display_name': 'On Hold'
        }
    ];

    function onDragEnd(result: any): void { // eslint-disable-line
        const {source, destination} = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
    }

    return (
        <div className="kanban">
            <h2>{t('kanban.title')}</h2>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-board">
                    {statuses.map((status, index) => (
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
                                        {groupedTasks[status.name]?.map((task, index) => (
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