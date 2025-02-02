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

const tasksSlice = createSlice({
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
        addTasks: (state, action) => {
            const {tasks} = action.payload;
            tasks.forEach((task) => {
                if (!state.byId[`${task.project_id}`]) {
                    state.byId[`${task.project_id}`] = {
                        byId: {},
                        allIds: []
                    }
                }

                const project = state.byId[`${task.project_id}`]

                project.byId[`${task.id}`] = task;
                if (!project.byId[`${task.id}`]) {
                    project.allIds.push(`${task.id}`);
                }
            })
        },
        addProject: (state, action) => {
            const {project} = action.payload;
            const tasks = project.tasks
            delete project.tasks
            state.byId[`${task.project_id}`] = project
            addTasks({
                tasks: tasks
            })
        },
        updateTaskStatus: (state, action) => {
            const {project_id, task_id, status} = action.payload;
            state.byId[`${project_id}`].byId[`${task_id}`].status = status
        },
    }
});

export const {addTask, addTasks, updateTaskStatus, addCommentToTask, updateCommentsForTask} = tasksSlice.actions;

export default tasksSlice.reducer;