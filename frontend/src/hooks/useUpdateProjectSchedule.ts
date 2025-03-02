import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";

const useUpdateSchedule = () => {
    const { updateData, loading, error, data } = useUpdate();

    const getUrl = (project_id: number, wanted_start: string, wanted_end: string) => `${import.meta.env.VITE_BACKEND_HOST}/project/${project_id}/use_suggested_schedule?wanted_start=${wanted_start}&wanted_end=${wanted_end}`;

    const updateProjectSchedule = useCallback((project_id: number, wanted_start: string, wanted_end: string) => {
        const url = getUrl(project_id, wanted_start, wanted_end);
        updateData(url, null, { method: 'PUT' });
    }, [updateData]);

    return { updateProjectSchedule, loading, error, data };
};

export default useUpdateSchedule;