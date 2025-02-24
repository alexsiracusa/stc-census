import useFetch from "./useFetch";
import { setCPM } from "../redux/features/projects/projectsReducer.js";

const useFetchCPM = (project_id: number) => {
    const host = import.meta.env.VITE_BACKEND_HOST;
    const url = `${host}/project/${project_id}/cpm`;
    return useFetch(url, setCPM);
};

export default useFetchCPM;
