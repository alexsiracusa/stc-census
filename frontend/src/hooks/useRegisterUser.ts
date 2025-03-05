import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";
import {addAccount} from "../redux/features/accounts/accountsReducer.js";


const useRegister = () => {
    const { updateData, loading, error, data } = useUpdate();

    const getUrl = () => `${import.meta.env.VITE_BACKEND_HOST}/auth/register`;

    const register = useCallback((email, first_name, last_name, password) => {
        const url = getUrl();
        const options = {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                first_name: first_name,
                last_name: last_name,
                password: password
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };
        const update = (body) => {
            return addAccount(body)
        }
        updateData(url, update, options);
    }, [updateData]);

    return { register, loading, error, data };
};

export default useRegister;