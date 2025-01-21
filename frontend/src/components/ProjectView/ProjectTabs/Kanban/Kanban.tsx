import './Kanban.css'

import TabProps from "../TabProps.ts";
import AddTask from "./AddTask.tsx";
import TaskRow from "../../../TaskRow/TaskRow.tsx";

const Kanban = (props: TabProps) => {
    const project = props.project;

    return (
        <div>Kanban {props.project['id']}
            <div>
                <AddTask></AddTask>

                <div className='task-list'>
                    <>
                        {project['tasks'].length > 0 &&
                            <div className='tasks'>
                                <h3>Tasks</h3>
                                <ul>
                                    {project['tasks'].map((task) => (
                                        <li key={task.id}>
                                            <TaskRow task={task} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        }
                    </>
                </div>
            </div>
        </div>



    )
};

export default Kanban;