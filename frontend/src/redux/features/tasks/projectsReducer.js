import {createSlice} from '@reduxjs/toolkit';

/*
Example State Structure

{
    projects: {
        byId: {
            "1": {
                "id": 1,
                "name": "Awards Ceremony",
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
        "dashboard": [1, 2, 3... ]
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
            const {project} = action.payload;
            const oldProject = state.byId[`${project.id}`]

            // combine old project with new project
            state.byId[`${project.id}`] = {...oldProject, ...project}
            const newProject = state.byId[`${project.id}`]

            if (newProject.tasks === undefined) { return }

            newProject.byId = {}
            newProject.tasks.forEach((task) => {
                state.byId[`${newProject.id}`].byId[`${task.id}`] = task
            })

            delete newProject.tasks
        },
        updateTaskStatus: (state, action) => {
            const {project_id, task_id, status} = action.payload;
            state.byId[`${project_id}`].byId[`${task_id}`].status = status
        },
        setDashboard: (state, action) => {
            const {projects} = action.payload;

            state.dashboard = projects.map((project) => project.id)

            projects.forEach((project) => {
                projectSlice.caseReducers.addProject(state, {
                    payload: { project: project }
                })
            })
        }
    }
});

export const {
    addProject,
    updateTaskStatus,
    setDashboard,
} = projectSlice.actions;

export default projectSlice.reducer;