import {createSlice} from '@reduxjs/toolkit';

/*
Example State Structure
{
    projects: {
        byId: {
            "project1": {
                byId: {
                    "task1": {

                    }
                }
                allIds: ["task1"]
            },
            "project1_task2": {
                project_id: "project1",
                task_id: "task2",
                status: "completed"
            }
        },
        allIds: ["project1_task1", "project1_task2"]
    }
}
 */

export const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        byId: {},
        allIds: []
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