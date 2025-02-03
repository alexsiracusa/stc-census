import { setDashboard } from "../redux/features/tasks/projectsReducer.js";
import useFetch from "./useFetch";

const useFetchDashboard = () => {
    const host = import.meta.env.VITE_BACKEND_HOST;
    const url = `${host}/projects/`;
    return useFetch(url, setDashboard);
};

export default useFetchDashboard;