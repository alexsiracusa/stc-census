import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";
import {updateTask as updateTaskRedux} from "../redux/features/tasks/projectsReducer.js";


const useUpdateTask = () => {
    const { updateData, loading, error, data } = useUpdate();

    const getUrl = (project_id, task_id) => `${import.meta.env.VITE_BACKEND_HOST}/project/${project_id}/task/${task_id}/update`;

    const updateTask = useCallback((project_id, task_id, body) => {
        const url = getUrl(project_id, task_id);
        const options = {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        };
        const update = () => {
            return updateTaskRedux({project_id, task_id, body})
        }
        updateData(url, update, options);
    }, [updateData]);

    return { updateTask, loading, error, data };
};

export default useUpdateTask;