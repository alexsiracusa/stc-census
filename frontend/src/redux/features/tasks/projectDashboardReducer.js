import {createSlice} from "@reduxjs/toolkit";
import {projectSummarySlice} from "./projectSummaryReducer.js";


export const projectDashboardSlice = createSlice({
    name: 'projectDashboard',
    initialState: {},
    reducers: {
        addProjects: (state, action) => {
            const {projects} = action.payload;

            state.list = projects.map((project) => project.id)

            projects.forEach((project) => {
                projectSummarySlice.caseReducers.addProjectSummary(state, {
                    payload: { project: project }
                })
            })
        }
    }
});

export const {
    addProjects
} = projectDashboardSlice.actions;

export default projectDashboardSlice.reducer;