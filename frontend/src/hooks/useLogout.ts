import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";
import {setUser} from "../redux/features/accounts/accountsReducer.js";


const useLogout = () => {
    const { updateData, loading, error, data } = useUpdate();

    const getUrl = () => `${import.meta.env.VITE_BACKEND_HOST}/auth/logout`;

    const logout = useCallback(() => {
        const url = getUrl();
        const options = {
            method: 'POST',
        };
        const update = () => {
            return setUser(null)
        }
        updateData(url, update, options);
    }, [updateData]);

    return { logout, loading, error, data };
};

export default useLogout;