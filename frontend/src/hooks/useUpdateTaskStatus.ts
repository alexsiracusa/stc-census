import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";
import {updateTaskStatus as updateTaskStatusRedux} from "../redux/features/tasks/projectsReducer.js";


const useUpdateTaskStatus = () => {
    const { updateData, loading, error, data } = useUpdate();

    // Prepare a base URL for status updates
    const getUrl = (project_id, task_id) => `${import.meta.env.VITE_BACKEND_HOST}/project/${project_id}/task/${task_id}/update`;

    // Create a callback to update task status
    const updateTaskStatus = useCallback((project_id, task_id, status) => {
        const url = getUrl(project_id, task_id);
        const options = {
            method: 'PUT',
            body: JSON.stringify({
                status: status
            })
        };
        const update = () => {
            return updateTaskStatusRedux({project_id, task_id, status})
        }
        updateData(url, update, options);
    }, [updateData]); // Include `updateData` and `actionCreator` as dependencies

    return { updateTaskStatus, loading, error, data };
};

export default useUpdateTaskStatus;