import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";

const useUpdateSchedule = () => {
    const { updateData, loading, error, data } = useUpdate();

    const getUrl = (project_id: number) => `${import.meta.env.VITE_BACKEND_HOST}/project/${project_id}/use_suggested_schedule`;

    const updateProjectSchedule = useCallback((project_id: number) => {
        const url = getUrl(project_id);
        updateData(url, null, { method: 'PUT' });
    }, [updateData]);

    return { updateProjectSchedule, loading, error, data };
};

export default useUpdateSchedule;