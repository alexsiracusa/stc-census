import './TaskList.css'

import TabProps from "../TabProps.ts";
import ProjectRow from "../../../ProjectRow/ProjectRow.tsx";
import ProjectRowHeader from "../../../ProjectRow/ProjectRowHeader.tsx";
import TaskRow from "../../../../TaskComponents/TaskRow/TaskRow.tsx";
import TaskRowHeader from "../../../../TaskComponents/TaskRow/TaskRowHeader.tsx";
import AddTaskButton from "../../../../TaskComponents/AddTaskButton/AddTaskButton.tsx";
import AddProjectButton from "../../../AddProjectButton/AddProjectButton.tsx";
import {useState} from "react";
import {sortArray, SortOptions} from "../../../../../utils/sort.ts";
import {Task} from "../../../../../types/Task.ts";
import {Project} from "../../../../../types/Project.ts";

import {useSelector} from "react-redux";

import ProjectEditingHeader
    from "../../../../GenericComponents/EditingHeader/ProjectEditingHeader/ProjectEditingHeader.tsx";
import TaskEditingHeader from "../../../../GenericComponents/EditingHeader/TaskEditingHeader/TaskEditingHeader.tsx";


const TaskList = (props: TabProps) => {
    const project = useSelector((state) => state.projects.byId[props.project_id]);

    // Task states
    const [taskSortOptions, setTaskSortOptions] = useState({key: 'id', order: 'asc'} as SortOptions<Task>)
    const sortedTasks = sortArray(Object.values(project.byId), taskSortOptions) as Task[]
    const selectedTasks = new Set<{ project_id: number, id: number }>();
    const [editingTasks, setEditingTasks] = useState(false)

    // Project states
    const [projectSortOptions, setProjectSortOptions] = useState({
        key: 'target_completion_date',
        order: 'asc'
    } as SortOptions<Project>)
    const sortedProjects = sortArray(Object.values(project.sub_projects), projectSortOptions) as Project[]
    const selectedProjects = new Set<number>();
    const [editingProjects, setEditingProjects] = useState(false)

    const selectTask = (project_id: number, id: number) => {
        selectedTasks.add({
            project_id: project_id,
            id: id
        })
    }

    const deselectTask = (project_id: number, id: number) => {
        selectedTasks.forEach((task) => {
            if (task.project_id === project_id && task.id === id) selectedTasks.delete(task);
        });
    }

    if (project.byId == null) {
        return <></>
    }

    return (
        <div className='task-list'>
            <div className='sub-projects'>
                <ProjectEditingHeader
                    editing={editingProjects}
                    setEditing={setEditingProjects}
                    selected={selectedProjects}
                />

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
                <TaskEditingHeader
                    editing={editingTasks}
                    setEditing={setEditingTasks}
                    selected={selectedTasks}
                />

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
                                                if (value) selectTask(props.project_id, task.id)
                                                else deselectTask(props.project_id, task.id)
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