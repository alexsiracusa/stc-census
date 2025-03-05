import useUpdate from "./useUpdate.ts";
import {useCallback} from "react";
import {addAccount as addAccountRedux} from "../redux/features/accounts/accountsReducer.js";


const useUpdateAccount = () => {
    const { updateData, loading, error, data } = useUpdate();

    const getUrl = (account_id) => `${import.meta.env.VITE_BACKEND_HOST}/account/${account_id}/update`;

    const updateAccount = useCallback((account_id, body) => {
        const url = getUrl(account_id);
        const options = {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        };
        const update = () => {
            return addAccountRedux({account_id, body})
        }
        updateData(url, update, options);
    }, [updateData]);

    return { updateAccount, loading, error, data };
};

export default useUpdateAccount;