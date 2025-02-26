import useFetch from "./useFetch";
import { setTask } from "../redux/features/projects/projectsReducer.js";

const useFetchTask = (project_id: number, task_id: number) => {
    const host = import.meta.env.VITE_BACKEND_HOST;
    const url = `${host}/project/${project_id}/task/${task_id}`;
    return useFetch(url, setTask);
};

export default useFetchTask;
