import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";
import {updateTaskDependencies as updateTaskDependenciesRedux} from "../redux/features/tasks/projectsReducer.js";


const useUpdateTaskDependsOn = () => {
    const { updateData, loading, error, data } = useUpdate();

    // Prepare a base URL for status updates
    const getUrl = (project_id, task_id) => `${import.meta.env.VITE_BACKEND_HOST}/project/${project_id}/task/${task_id}/update`;

    // Create a callback to update task status
    const updateTaskDependsOn = useCallback((project_id, task_id, depends_on) => {
        const url = getUrl(project_id, task_id);
        console.log(depends_on)
        const options = {
            method: 'PUT',
            body: JSON.stringify({
                depends_on: depends_on
            })
        };
        const update = () => {
            return updateTaskDependenciesRedux({project_id, task_id, depends_on})
        }
        updateData(url, update, options);
    }, [updateData]);

    return { updateTaskDependsOn, loading, error, data };
};

export default useUpdateTaskDependsOn;