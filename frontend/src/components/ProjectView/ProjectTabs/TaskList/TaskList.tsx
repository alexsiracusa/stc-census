import './TaskList.css'

import TabProps from "../TabProps.ts";
import ProjectRow from "../../../ProjectRow/ProjectRow.tsx";
import ProjectRowHeader from "../../../ProjectRow/ProjectRowHeader.tsx";
import TaskRow from "../../../TaskComponents/TaskRow/TaskRow.tsx";
import TaskRowHeader from "../../../TaskComponents/TaskRow/TaskRowHeader.tsx";
import AddTaskButton from "../../../AddTaskButton/AddTaskButton.tsx";
import AddProjectButton from "../../../AddProjectButton/AddProjectButton.tsx";
import {useTranslation} from 'react-i18next';
import {useState} from "react";
import {sortArray, SortOptions} from "../../../../utils/sort.ts";
import {Task} from "../../../../types/Task.ts";
import {Project} from "../../../../types/Project.ts";

import {useSelector} from "react-redux";


const TaskList = (props: TabProps) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const [taskSortOptions, setTaskSortOptions] = useState({key: 'id', order: 'asc'} as SortOptions<Task>)
    const [projectSortOptions, setProjectSortOptions] = useState({key: 'target_completion_date', order: 'asc'} as SortOptions<Project>)
    const {t} = useTranslation();

    const sortedTasks = sortArray(Object.values(project.byId), taskSortOptions) as Task[]
    const sortedProjects = sortArray(Object.values(project.sub_projects), projectSortOptions) as Project[]

    if (project.byId == null) {
        return <></>
    }

    return (
        <div className='task-list'>
            <div className='sub-projects'>
                <h3>{t('projectList.subProjects')}</h3>
                <AddProjectButton project_id={props.project_id}/>

                <div className='list-container'>

                    {sortedProjects.length > 0 &&
                        <>
                            <ProjectRowHeader
                                projectSortOptions={projectSortOptions}
                                setProjectSortOptions={setProjectSortOptions}
                            />
                            <ul>
                                {sortedProjects.map((project) => (
                                    <li key={project.id}>
                                        <ProjectRow project_id={project.id}/>
                                    </li>
                                ))}
                            </ul>
                        </>
                    }

                </div>
            </div>


            <div className='tasks'>
                <h3>{t('taskList.tasks')}</h3>
                <AddTaskButton project_id={props.project_id}/>

                <div className='list-container'>

                    {sortedTasks.length > 0 &&
                        <>
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
                        </>
                    }
                </div>
            </div>
        </div>
    )
};

export default TaskList;