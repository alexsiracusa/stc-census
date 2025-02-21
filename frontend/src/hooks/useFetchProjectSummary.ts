import useFetch from "./useFetch.ts";
import {addProject} from "../redux/features/projects/projectsReducer.js";

const useFetchProjectSummary = (project_id) => {
    const host = import.meta.env.VITE_BACKEND_HOST;
    const url = `${host}/project/${project_id}/summary`;
    return useFetch(url, addProject);
};

export default useFetchProjectSummary;