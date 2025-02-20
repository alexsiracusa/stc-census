import {configureStore} from '@reduxjs/toolkit'

import projectReducer from '../features/tasks/projectsReducer.js'

export default configureStore({
    reducer: {
        projects: projectReducer,
    },
})