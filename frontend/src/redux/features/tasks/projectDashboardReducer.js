import {createSlice} from "@reduxjs/toolkit";
import {projectSummarySlice} from "./projectSummaryReducer.js";

/*
Example State Structure

{
    "projectDashboard": [1, 2, 3, 4... ]
}
 */

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