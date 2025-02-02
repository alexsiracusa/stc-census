import './TaskList.css'

import TabProps from "../TabProps.ts";
import ProjectRow from "../../../ProjectRow/ProjectRow.tsx";
import TaskRow from "../../../TaskRow/TaskRow.tsx";
import TaskRowHeader from "../../../TaskRow/TaskRowHeader.tsx";
import { useTranslation } from 'react-i18next';

import {useSelector} from "react-redux";


const TaskList = (props: TabProps) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const tasks = useSelector((state) => state.projects.byId[props.project_id].byId);
    const { t } = useTranslation();

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
                                    <ProjectRow project_id={props.project_id}/>
                                </li>
                            ))}
                        </ul>
                    </div>
                }

                {Object.keys(tasks).length &&
                    <div className='tasks'>
                        <h3>{t('taskList.tasks')}</h3>

                        <TaskRowHeader/>

                        <ul>
                            {Object.values(tasks).map((task) => (
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
            </>
        </div>
    )
};

export default TaskList;