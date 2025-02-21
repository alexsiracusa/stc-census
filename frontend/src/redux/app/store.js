import {configureStore} from '@reduxjs/toolkit'

import projectReducer from '../features/projects/projectsReducer.js'
import accountsReducer from "../features/accounts/accountsReducer.js";

export default configureStore({
    reducer: {
        projects: projectReducer,
        accounts: accountsReducer,
    },
})