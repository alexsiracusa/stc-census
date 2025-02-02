import {createSlice} from "@reduxjs/toolkit";

export const projectSummarySlice = createSlice({
    name: 'projectSummaries',
    initialState: {},
    reducers: {
        addProjectSummary: (state, action) => {
            const {project} = action.payload;
            state[project.id] = project
        }
    }
});

export const {
    addProjectSummary
} = projectSummarySlice.actions;

export default projectSummarySlice.reducer;