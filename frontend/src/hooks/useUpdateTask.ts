import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";
import {updateTask as updateTaskRedux} from "../redux/features/projects/projectsReducer.js";


const useUpdateTask = () => {
    const { updateData, loading, error, data } = useUpdate();

    const getUrl = (project_id, task_id) => `${import.meta.env.VITE_BACKEND_HOST}/project/${project_id}/task/${task_id}/update`;

    const updateTask = useCallback((project_id, task_id, body) => {
        const url = getUrl(project_id, task_id);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { person_in_charge, ...rest } = body;
        const options = {
            method: 'PUT',
            body: JSON.stringify(rest),
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