import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";

const useFetchProjectDownload = () => {
    const {updateData, loading, error, data} = useUpdate();

    // Prepare a base URL for status updates
    const getUrl = (project_id: number) => `${import.meta.env.VITE_BACKEND_HOST}/project/${project_id}/with-descendants`;

    // Create a callback to update task status
    const downloadProject = useCallback((project_id: number) => {
        const url = getUrl(project_id);
        updateData(url, null, { method: 'GET' });
    }, [updateData]);

    return {downloadProject: downloadProject, loading, error, data};
};

export default useFetchProjectDownload;