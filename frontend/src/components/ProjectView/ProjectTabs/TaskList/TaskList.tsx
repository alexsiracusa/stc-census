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

import Edit from '../../../../assets/Icons/Edit2.svg'
import XMark from '../../../../assets/Icons/X.svg'
import Trash from '../../../../assets/Icons/Trash2.svg'
import ConfirmPopup from "../../../ConfirmPopup/ConfirmPopup.tsx";
import useDeleteProjects from "../../../../hooks/useDeleteProjects.ts";


const TaskList = (props: TabProps) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);
    const [taskSortOptions, setTaskSortOptions] = useState({key: 'id', order: 'asc'} as SortOptions<Task>)
    const [projectSortOptions, setProjectSortOptions] = useState({
        key: 'target_completion_date',
        order: 'asc'
    } as SortOptions<Project>)
    const [editingProjects, setEditingProjects] = useState(false)
    const [editingTasks, setEditingTasks] = useState(false)
    const {t} = useTranslation();
    const {deleteProjects, loading, error, data} = useDeleteProjects();

    const sortedTasks = sortArray(Object.values(project.byId), taskSortOptions) as Task[]
    const sortedProjects = sortArray(Object.values(project.sub_projects), projectSortOptions) as Project[]

    let selectedTasks = new Set<number>();
    let selectedProjects = new Set<number>();

    if (project.byId == null) {
        return <></>
    }

    return (
        <div className='task-list'>
            <div className='sub-projects'>
                <div className='header'>
                    <h3>{t('projectList.subProjects')}</h3>

                    <button
                        className='edit-button'
                        title={editingProjects ? 'Cancel' : 'Edit'}
                        onClick={() => {
                            selectedProjects = new Set<number>();
                            setEditingProjects(!editingProjects)
                        }}
                    >
                        <img src={editingProjects ? XMark : Edit}/>
                    </button>

                    {editingProjects && (
                        <ConfirmPopup
                            className='delete-button'
                            message='Are you sure you want to delete all selected subprojects? It better to archive them instead. This cannot be undone.'
                            left={{
                                text: 'Delete',
                                onPress: () => {
                                    deleteProjects(Array.from(selectedProjects.values()))
                                    setEditingProjects(false)
                                },
                                type: 'destructive',
                            }}
                            right={{
                                text: 'Cancel',
                                onPress: () => {
                                    setEditingProjects(false)
                                },
                                type: 'neutral'
                            }}
                        >
                            <img src={Trash}/>
                        </ConfirmPopup>
                    )}
                </div>

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
                                        <ProjectRow
                                            project_id={project.id}
                                            editing={editingProjects}
                                            select={(value) => {
                                                if (value) selectedProjects.add(project.id)
                                                else selectedProjects.delete(project.id)
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </>
                    }

                </div>
            </div>


            <div className='tasks'>
                <div className='header'>
                    <h3>{t('taskList.tasks')}</h3>

                    <button
                        className='edit-button'
                        title={editingTasks ? 'Cancel' : 'Edit'}
                        onClick={() => {
                            selectedTasks = new Set<number>();
                            setEditingTasks(!editingTasks)
                        }}
                    >
                        <img src={editingTasks ? XMark : Edit}/>
                    </button>

                    {editingTasks && (
                        <ConfirmPopup
                            className='delete-button'
                            message='Are you sure you want to delete all selected tasks? This cannot be undone.'
                            left={{
                                text: 'Delete',
                                onPress: () => {
                                    setEditingTasks(false)
                                },
                                type: 'destructive',
                            }}
                            right={{
                                text: 'Cancel',
                                onPress: () => {
                                    setEditingTasks(false)
                                },
                                type: 'neutral'
                            }}
                        >
                            <img src={Trash}/>
                        </ConfirmPopup>
                    )}
                </div>

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
                                            editing={editingTasks}
                                            select={(value) => {
                                                if (value) selectedTasks.add(task.id)
                                                else selectedTasks.delete(task.id)
                                            }}
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