import './TaskDependsEditor.css'

import TaskIcon from "../TaskIcon/TaskIcon.tsx";
import MinusIcon from "../../../assets/Icons/Minus.svg";
import PlusIcon from "../../../assets/Icons/Plus.svg";
import {useState, useMemo} from "react";
import useUpdateTask from "../../../hooks/useUpdateTask.ts";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import PathEditor from "../../GenericComponents/Path/PathEditor/PathEditor.tsx";
import {createSelector} from 'reselect';
import useFetchProject from "../../../hooks/useFetchProject.ts";
import TaskPopup from "../TaskPopup/TaskPopup.tsx";

// Input selectors: These grab pieces of the state directly.
const selectProjectsById = (state) => state.projects.byId;

// Higher-order selector: This memoizes the derived result.
const makeSelectDependsOn = (task) => {
    return createSelector(
        [selectProjectsById],
        (projectsById) => {
            return task.depends_on.map((depends_on) => {
                const project = projectsById[depends_on.project_id];
                if (project) {
                    return project.byId[depends_on.task_id];
                }
                return undefined; // Handle cases where the project or task doesn't exist
            });
        }
    );
}

type TaskDependsEditorProps = {
    project_id: number
    task_id: number
}

const TaskDependsEditor = (props: TaskDependsEditorProps) => {
    const [projectId, setProjectId] = useState(props.project_id)
    const {loading, error} = useFetchProject(projectId);
    const project = useSelector((state) => state.projects.byId[projectId]);
    const task = useSelector((state) => state.projects.byId[props.project_id].byId[props.task_id]);

    const selectDependsOn = useMemo(() => makeSelectDependsOn(task), [task]);
    const depends_on = useSelector((state) => selectDependsOn(state));
    const options = Object.values(project ? project.byId ?? {} : {}).filter((option) => !task.depends_on.some((task) => task.project_id === option.project_id && task.task_id === option.id))

    const {updateTask, updateLoading, updateError, data} = useUpdateTask();
    const {t} = useTranslation()

    if (!project || !project.byId || !project.path) {
        return <>Loading</>
    }

    const select = (project_id) => {
        if (project_id) {
            setProjectId(project_id)
        }
    }

    return (
        <div className='task-depends-editor'>
            {depends_on.length != 0 &&
                <ul>
                    <div
                        className='task-depends-editor-header task-field-header'>{t('taskDependsEditor.dependsOn') + ':'}</div>
                    {depends_on.length != 0 && depends_on.map((option) => (
                        <div
                            className='task-depends-editor-row remove-from-list'
                            key={`${option.project_id}-${option.id}`}
                        >
                            <TaskIcon project_id={option.project_id} task_id={option.id}/>

                            <p className='task-name'>{option.name}</p>

                            <button
                                title={t('taskDependsEditor.remove')}
                                className={'minus-button'}
                                onClick={() => {
                                    updateTask(props.project_id, props.task_id, {
                                        depends_on: task.depends_on.filter((task) => {
                                            return task.project_id != option.project_id || task.task_id != option.id
                                        })
                                    })
                                }}
                            >
                                <img src={MinusIcon}/>
                            </button>
                        </div>
                    ))}
                </ul>
            }

            <PathEditor path={project.path} select={select}/>

            {options.length != 0 &&
                <ul>
                    <div
                        className='task-depends-editor-header task-field-header'>{t('taskDependsEditor.addDependencies') + ':'}</div>
                    {options
                        .filter((option) => option.project_id != task.project_id || option.id != task.id)
                        .map((option) => (
                            <div
                                className='task-depends-editor-row add-to-list'
                                key={`${option.project_id}-${option.id}`}
                            >
                                <TaskIcon project_id={option.project_id} task_id={option.id} clickable={true}/>

                                <p className='task-name'>{option.name}</p>

                                <button
                                    title={t('taskDependsEditor.add')}
                                    className={'plus-button'}
                                    onClick={() => {
                                        updateTask(props.project_id, props.task_id, {
                                            depends_on: [...task.depends_on, {
                                                project_id: option.project_id,
                                                task_id: option.id
                                            }]
                                        })
                                    }}
                                >
                                    <img src={PlusIcon}/>
                                </button>
                            </div>
                        ))}
                </ul>
            }
        </div>
    )
}

export default TaskDependsEditor