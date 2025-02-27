import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";
import {setUser} from "../redux/features/accounts/accountsReducer.js";


const useLogin = () => {
    const { updateData, loading, error, data } = useUpdate();

    const getUrl = () => `${import.meta.env.VITE_BACKEND_HOST}/auth/login`;

    const login = useCallback((email, password) => {
        const url = getUrl();
        const options = {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };
        const update = (body) => {
            return setUser(body)
        }
        updateData(url, update, options);
    }, [updateData]);

    return { login, loading, error, data };
};

export default useLogin;