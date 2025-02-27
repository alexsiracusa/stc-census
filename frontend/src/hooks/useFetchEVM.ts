// useFetchEVM.ts
import useFetch from "./useFetch";
import { setEVM } from "../redux/features/projects/projectsReducer.js";

const useFetchEVM = (project_id: number) => {
    const host = import.meta.env.VITE_BACKEND_HOST;
    const url = `${host}/project/${project_id}/evm`;
    return useFetch(url, setEVM);
};

export default useFetchEVM;
