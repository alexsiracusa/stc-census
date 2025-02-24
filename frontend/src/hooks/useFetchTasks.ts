import useFetch from "./useFetch";
import { setTasks } from "../redux/features/projects/projectsReducer.js";

const useFetchTasks = (project_id: number) => {
    const host = import.meta.env.VITE_BACKEND_HOST;
    const url = `${host}/project/${project_id}/all-tasks`;
    return useFetch(url, setTasks);
};

export default useFetchTasks;
