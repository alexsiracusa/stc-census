import {configureStore} from '@reduxjs/toolkit'

import taskReducer from '../features/tasks/projectsReducer.js'
import projectDashboardReducer from "../features/tasks/projectDashboardReducer.js";
import projectSummaryReducer from "../features/tasks/projectSummaryReducer.js";

export default configureStore({
    reducer: {
        projects: taskReducer,
        projectDashboard: projectDashboardReducer,
        projectSummaries: projectSummaryReducer,
    },
})