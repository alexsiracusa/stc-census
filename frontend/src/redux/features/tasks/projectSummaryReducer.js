import {createSlice} from "@reduxjs/toolkit";

/*
Example State Structure

{
    "projectSummaries": {
        "1": {
            "id": 1,
             "parent": null,
            "name": "Awards Ceremony",
            "description": null,
            "status": "not_started",
            "budget": null,
            "created_at": "2025-02-02T06:24:32.783558"
        },
        "2": {
            "id": 2,
            "parent": null,
            "name": "Create Flyer"
            ...
        }
        ...
    }
}

 */

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