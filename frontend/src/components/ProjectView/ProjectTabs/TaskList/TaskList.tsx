import './TaskList.css'

import TabProps from "../TabProps.ts";
import ProjectRow from "../../../ProjectRow/ProjectRow.tsx";
import TaskRow from "../../../TaskRow/TaskRow.tsx";
import TaskRowHeader from "../../../TaskRow/TaskRowHeader.tsx";
import AddTaskButton from "./AddTaskButton/AddTaskButton.tsx";
import {useTranslation} from 'react-i18next';
import {useState} from "react";
import {sortArray, SortOptions} from "../../../../utils/sort.ts";
import {Task} from "../../../../types/Task.ts";

import {useSelector} from "react-redux";


const TaskList = (props: TabProps) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const tasks = useSelector((state) => state.projects.byId[props.project_id].byId);
    const [taskSortOptions, setTaskSortOptions] = useState({key: 'id', order: 'asc'} as SortOptions<Task>)
    const {t} = useTranslation();

    const sortedTasks = sortArray(Object.values(tasks), taskSortOptions) as Task[]

    if (tasks == null) {
        return <></>
    }

    return (
        <div className='task-list'>
            <>
                {project['sub_projects'].length > 0 &&
                    <div className='sub-projects'>
                        <h3>{t('taskList.subProjects')}</h3>
                        <ul>
                            {project['sub_projects'].map((project) => (
                                <li key={project.id}>
                                    <ProjectRow project_id={project.id}/>
                                </li>
                            ))}
                        </ul>
                    </div>
                }


                <div className='tasks'>
                    <h3>{t('taskList.tasks')}</h3>

                    {Object.keys(tasks).length &&
                        <div className='list-container'>
                            <TaskRowHeader
                                taskSortOptions={taskSortOptions}
                                setTaskSortOptions={setTaskSortOptions}
                            />
                            <ul>
                                {sortedTasks.map((task) => (
                                    <li key={task.id}>
                                        <TaskRow
                                            task_id={task.id}
                                            project_id={task.project_id}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }

                    <AddTaskButton/>
                </div>

            </>
        </div>
    )
};

export default TaskList;