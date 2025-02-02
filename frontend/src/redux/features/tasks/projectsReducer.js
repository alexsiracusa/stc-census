import {createSlice} from '@reduxjs/toolkit';

/*
Example State Structure

{
    projects: {
        byId: {
            "1": {
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
            const {project} = action.payload;
            state.byId[`${project.id}`] = project

            project.byId = {}
            project.tasks.forEach((task) => {
                state.byId[`${project.id}`].byId[`${task.id}`] = task
            })

            delete project.tasks
        },
        updateTaskStatus: (state, action) => {
            const {project_id, task_id, status} = action.payload;
            state.byId[`${project_id}`].byId[`${task_id}`].status = status
        },
    }
});

export const {
    addProject,
    updateTaskStatus,
} = projectSlice.actions;

export default projectSlice.reducer;