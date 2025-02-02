import {createSlice} from '@reduxjs/toolkit';

/*
Example State Structure
{
    projects: {
        byId: {
            "project1": {
                tasks: {
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

const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        byId: {},
        allIds: []
    },
    reducers: {
        addTask: (state, action) => {
            const {project_id, task_id, status, comments} = action.payload;
            const uniqueId = `${project_id}_${task_id}`;
            if (!state.byId[uniqueId]) {
                state.byId[uniqueId] = {project_id, task_id, status, comments: comments || []};
                state.allIds.push(uniqueId);
            }
        },
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

export const {addTask, addTasks, addProject, updateTaskStatus, addCommentToTask, updateCommentsForTask} = projectSlice.actions;

export default projectSlice.reducer;