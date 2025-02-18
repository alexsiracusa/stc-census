import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";
import {deleteTasks as deleteTasksRedux} from "../redux/features/tasks/projectsReducer.js";


const useDeleteTasks = () => {
    const {updateData, loading, error, data} = useUpdate();

    const getUrl = () => `${import.meta.env.VITE_BACKEND_HOST}/tasks/delete`;

    const deleteTasks = useCallback((task_ids) => {
        const url = getUrl();
        const options = {
            method: 'DELETE',
            body: JSON.stringify({
                task_ids: task_ids
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };
        const update = () => {
            return deleteTasksRedux({task_ids})
        }
        updateData(url, update, options);
    }, [updateData]);

    return {deleteTasks, loading, error, data};
};

export default useDeleteTasks;