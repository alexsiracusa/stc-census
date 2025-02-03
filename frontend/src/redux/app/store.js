import {configureStore} from '@reduxjs/toolkit'

import taskReducer from '../features/tasks/projectsReducer.js'
import projectSummaryReducer from "../features/tasks/projectSummaryReducer.js";

export default configureStore({
    reducer: {
        projects: taskReducer,
        projectSummaries: projectSummaryReducer,
    },
})