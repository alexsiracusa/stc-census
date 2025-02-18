import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";
import {createTask as createTaskRedux} from "../redux/features/tasks/projectsReducer.js";


const useCreateTask = () => {
    const { updateData, loading, error, data } = useUpdate();

    // Prepare a base URL for status updates
    const getUrl = (project_id) => `${import.meta.env.VITE_BACKEND_HOST}/project/${project_id}/task/create`;

    // Create a callback to update task status
    const createTask = useCallback((project_id, body) => {
        const url = getUrl(project_id);
        const options = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        };
        const update = (json) => {
            const task_id  = json['id']
            const body = {...json, depends_on: []}
            return createTaskRedux({project_id, task_id, body})
        }
        updateData(url, update, options);
    }, [updateData]);

    return { createTask, loading, error, data };
};

export default useCreateTask;