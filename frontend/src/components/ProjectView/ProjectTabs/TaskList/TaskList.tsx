import './TaskList.css'

import TabProps from "../TabProps.ts";
import ProjectRow from "../../../ProjectRow/ProjectRow.tsx";
import TaskRow from "../../../TaskRow/TaskRow.tsx";
import { useTranslation } from 'react-i18next';


const TaskList = (props: TabProps) => {
    const project = props.project;
    const { t } = useTranslation();

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
                        <ul>
                            {project['tasks'].map((task) => (
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