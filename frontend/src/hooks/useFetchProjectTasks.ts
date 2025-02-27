import useFetch from "./useFetch";
import { setAllTasks } from "../redux/features/projects/projectsReducer.js";

const useFetchProjectTasks = (project_id: number) => {
    const host = import.meta.env.VITE_BACKEND_HOST;
    const url = `${host}/project/${project_id}/all-tasks`;
    return useFetch(url, setAllTasks);
};

export default useFetchProjectTasks;
