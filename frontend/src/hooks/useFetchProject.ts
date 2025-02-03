import useFetch from "./useFetch.ts";
import {addProject} from "../redux/features/tasks/projectsReducer.js";

const useFetchProject = (project_id) => {
    const host = import.meta.env.VITE_BACKEND_HOST;
    const url = `${host}/project/${project_id}`;
    return useFetch(url, addProject);
};

export default useFetchProject;