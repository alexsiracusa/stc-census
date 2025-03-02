import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";

const useFetchProjectSuggestedSchedule = () => {
    const {updateData, loading, error, data} = useUpdate();

    // Prepare a base URL for status updates
    const getUrl = (project_id: number, wanted_start: string, wanted_end: string) => `${import.meta.env.VITE_BACKEND_HOST}/project/${project_id}/sensible_scheduling?wanted_start=${wanted_start}&wanted_end=${wanted_end}`;

    // Create a callback to update task status
    const fetchSuggestedSchedule = useCallback((project_id: number, wanted_start: string, wanted_end: string) => {
        const url = getUrl(project_id, wanted_start, wanted_end);
        updateData(url, null, { method: 'GET' });
    }, [updateData]);

    return {fetchSuggestedSchedule, loading, error, data};
};

export default useFetchProjectSuggestedSchedule;