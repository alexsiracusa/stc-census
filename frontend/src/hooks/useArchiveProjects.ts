import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";
import {deleteProjects as deleteProjectsRedux} from "../redux/features/projects/projectsReducer.js";


const useArchiveProjects = () => {
    const {updateData, loading, error, data} = useUpdate();

    const getUrl = () => `${import.meta.env.VITE_BACKEND_HOST}/projects/archive`;

    const archiveProjects = useCallback((project_ids) => {
        const url = getUrl();
        const options = {
            method: 'PUT',
            body: JSON.stringify({
                project_ids: project_ids
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };
        const update = () => {
            return deleteProjectsRedux({project_ids})
        }
        updateData(url, update, options);
    }, [updateData]);

    return {archiveProjects, loading, error, data};
};

export default useArchiveProjects;