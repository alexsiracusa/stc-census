import useFetch from "./useFetch";
import {setUser} from "../redux/features/accounts/accountsReducer.js";

const useFetchUsers = () => {
    const host = import.meta.env.VITE_BACKEND_HOST;
    const url = `${host}/auth/ping`;
    return useFetch(url, setUser);
};

export default useFetchUsers;