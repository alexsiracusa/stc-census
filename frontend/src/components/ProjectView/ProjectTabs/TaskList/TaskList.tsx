import './TaskList.css'

import TabProps from "../TabProps.ts";
import ProjectRow from "../../../ProjectRow/ProjectRow.tsx";
import TaskRow from "../../../TaskRow/TaskRow.tsx";
import TaskRowHeader from "../../../TaskRow/TaskRowHeader.tsx";
import { useTranslation } from 'react-i18next';

import {useSelector} from "react-redux";


const TaskList = (props: TabProps) => {
    const project = props.project;
    const { t } = useTranslation();

    const tasks = useSelector((state) => state.projects.byId[project.id].byId);
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
                                    <ProjectRow project={project}/>
                                </li>
                            ))}
                        </ul>
                    </div>
                }

                {project['tasks'].length > 0 &&
                    <div className='tasks'>
                        <h3>{t('taskList.tasks')}</h3>

                        <TaskRowHeader/>

                        <ul>
                            {Object.values(tasks).map((task) => (
                                <li key={task.id}>
                                    <TaskRow task={task}/>
                                </li>
                            ))}
                        </ul>
                    </div>
                }
            </>
        </div>
    )
};

export default TaskList;