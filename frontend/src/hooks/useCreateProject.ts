import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";
import {createProject as createProjectRedux} from "../redux/features/tasks/projectsReducer.js";


const useCreateProject = () => {
    const { updateData, loading, error, data } = useUpdate();

    // Prepare a base URL for status updates
    const getUrl = () => `${import.meta.env.VITE_BACKEND_HOST}/project/create`;

    // Create a callback to update task status
    const createProject = useCallback((body) => {
        const url = getUrl();
        const options = {
            method: 'POST',
            body: JSON.stringify(body)
        };
        const update = (json) => {
            const body = json
            return createProjectRedux({body})
        }
        updateData(url, update, options);
    }, [updateData]);

    return { createProject, loading, error, data };
};

export default useCreateProject;