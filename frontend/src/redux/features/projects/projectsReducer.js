import {createSlice} from '@reduxjs/toolkit';

/*
Example State Structure

{
    projects: {
        dashboard: [1, 2, 3... ]
        byId: {
            "1": {
                "id": 1,
                "name": "Awards Ceremony",
                "cpm": [
                    {
                        "task_id": 1,
                        "es": 0,
                        "ef": 0,
                        "ls": 0,
                        "lf": 0,
                        "slack": 0,
                        "critical": true
                    },
                    ...
                ],
                ...
                byId: {
                    "1": {
                        "id" 1,
                        "name": "Create supply list"
                        "status": "done"
                        ...
                    }
                    "2": {
                        "id" 2,
                        "name": "Get design approved",
                        "status": "to_do"
                        ...
                    }
                    ...
                }
            },
            "2": {
                "id": 2,
                ...
                "byId": {
                    "1": {
                        ...
                    }
                    ...
                }
            }
            ...
        }
    }
}
 */

export const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        byId: {},
    },
    reducers: {
        addProject: (state, action) => {
            const project = action.payload;
            const oldProject = state.byId[`${project.id}`]

            // combine old project with new project
            state.byId[`${project.id}`] = {...oldProject, ...project}
            const newProject = state.byId[`${project.id}`]

            if (newProject.tasks === undefined) {
                return
            }

            newProject.byId = {}
            newProject.tasks.forEach((task) => {
                state.byId[`${newProject.id}`].byId[`${task.id}`] = task
            })

            delete newProject.tasks
        },
        createProject: (state, action) => {
            const {body} = action.payload;
            state.byId[`${body.id}`] = body
            if (body.parent) {
                state.byId[`${body.parent}`].sub_projects.push(body)
            } else {
                state.dashboard.push(body.id)
            }
        },
        updateProject: (state, action) => {
            const {project_id, body} = action.payload;
            const project = state.byId[`${project_id}`]
            state.byId[`${project_id}`] = {...project, ...body}

            // update subproject entry in parent
            if (project.parent) {
                const parent = state.byId[`${project.parent}`]
                let index = parent.sub_projects.findIndex((project) => project.id === project_id);
                parent.sub_projects[index] = {...parent.sub_projects[index], ...body}
            }
        },
        deleteProjects: (state, action) => {
            const {project_ids} = action.payload;
            project_ids.forEach((project_id) => {
                // update subproject entry in parent
                const project = state.byId[`${project_id}`]
                if (project.parent) {
                    const parent = state.byId[`${project.parent}`]
                    parent.sub_projects = parent.sub_projects.filter((project) => project.id !== project_id)
                }

                delete state.byId[`${project_id}`]
            })

            if (state.dashboard) {
                state.dashboard = state.dashboard.filter((id) => !project_ids.includes(id))
            }
        },
        createTask: (state, action) => {
            const {project_id, task_id, body} = action.payload;
            state.byId[`${project_id}`].byId[`${task_id}`] = body
        },
        updateTask: (state, action) => {
            const {project_id, task_id, body} = action.payload;
            const task = state.byId[`${project_id}`].byId[`${task_id}`]
            state.byId[`${project_id}`].byId[`${task_id}`] = {...task, ...body}
        },
        deleteTask: (state, action) => {
            const {project_id, task_id} = action.payload;
            delete state.byId[`${project_id}`].byId[`${task_id}`]
        },
        deleteTasks: (state, action) => {
            const {task_ids} = action.payload;
            task_ids.forEach((task_id) => {
                delete state.byId[`${task_id.project_id}`].byId[`${task_id.id}`]
            })
        },
        setDashboard: (state, action) => {
            const projects = action.payload;

            state.dashboard = projects.map((project) => project.id)

            projects.forEach((project) => {
                projectSlice.caseReducers.addProject(state, {
                    payload: project
                })
            })
        },
        setTask: (state, action) => {
            const task = action.payload;
            const projectId = task.project_id;

            // Create a project placeholder if it doesn't exist.
            if (!state.byId[projectId]) {
                state.byId[projectId] = {id: projectId, byId: {}};
            }
            if (!state.byId[projectId].byId) {
                state.byId[projectId].byId = {};
            }
            state.byId[projectId].byId[task.id] = task;
        },
        setTasks: (state, action) => {
            const tasks = action.payload;
            tasks.forEach((task) => {
                projectSlice.caseReducers.setTask(state, {payload: {task: task}})
            });
        },
        setAllTasks: (state, action) => {
            const {project_id, all_tasks} = action.payload
            all_tasks.forEach((task) => {
                projectSlice.caseReducers.setTask(state, {payload: task})
            });

            // Ensure the project exists before adding all_tasks
            if (!state.byId[project_id]) {
                state.byId[project_id] = {id: project_id, byId: {}};
            }

            state.byId[project_id].all_tasks = all_tasks.map((task) => ({
                project_id: task.project_id,
                task_id: task.id
            }))
        },
        setCPM: (state, action) => {
            const json = action.payload;
            const projectId = json.id;
            // Create a placeholder for the project if it doesn't already exist.
            if (!state.byId[projectId]) {
                state.byId[projectId] = {id: projectId};
            }
            // Save the CPM-related data.
            state.byId[projectId].cpm = json.cpm;
            state.byId[projectId].cycleInfo = json.cycleInfo;
            state.byId[projectId].criticalPathLength = json.criticalPathLength;
        },
    }
});

export const {
    addProject,
    setDashboard,
    createProject,
    updateProject,
    deleteProjects,
    updateTask,
    createTask,
    deleteTask,
    deleteTasks,
    setTask,
    setTasks,
    setAllTasks,
    setCPM,
} = projectSlice.actions;

export default projectSlice.reducer;