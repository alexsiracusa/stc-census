import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";
import {updateProject as updateProjectRedux} from "../redux/features/projects/projectsReducer.js";


const useUpdateTask = () => {
    const { updateData, loading, error, data } = useUpdate();

    const getUrl = (project_id) => `${import.meta.env.VITE_BACKEND_HOST}/project/${project_id}/update`;

    const updateProject = useCallback((project_id, body) => {
        const url = getUrl(project_id);
        const options = {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        };
        const update = () => {
            return updateProjectRedux({project_id, body})
        }
        updateData(url, update, options);
    }, [updateData]);

    return { updateProject, loading, error, data };
};

export default useUpdateTask;