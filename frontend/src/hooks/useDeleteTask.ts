import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";
import {deleteTask as deleteTaskRedux} from "../redux/features/tasks/projectsReducer.js";


const useDeleteTask = () => {
    const { updateData, loading, error, data } = useUpdate();

    // Prepare a base URL for status updates
    const getUrl = (project_id, task_id) => `${import.meta.env.VITE_BACKEND_HOST}/project/${project_id}/task/${task_id}/delete`;

    // Create a callback to update task status
    const deleteTask = useCallback((project_id, task_id) => {
        const url = getUrl(project_id, task_id);
        const options = {
            method: 'DELETE',
        };
        const update = () => {
            return deleteTaskRedux({project_id, task_id})
        }
        updateData(url, update, options);
    }, [updateData]);

    return { deleteTask, loading, error, data };
};

export default useDeleteTask;