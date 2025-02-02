import {configureStore} from '@reduxjs/toolkit'
import taskReducer from '../features/tasks/projectsReducer.js'

export default configureStore({
    reducer: {
        projects: taskReducer,
    },
})