import useFetch from "./useFetch.ts";
import {setAccounts} from "../redux/features/accounts/accountsReducer.js";

const useFetchAccounts = () => {
    const host = import.meta.env.VITE_BACKEND_HOST;
    const url = `${host}/accounts`;
    return useFetch(url, setAccounts);
};

export default useFetchAccounts;