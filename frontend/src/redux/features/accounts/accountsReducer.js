import {createSlice} from '@reduxjs/toolkit';

/*
Example State Structure

{
    accounts: {
        byId: {
            "1": {
                id: 1
                email: "alexander.siracusa@gmail.com",
                first_name: "alexander",
                last_name: "siracusa"
            }
            ...
        }
    }
}
 */

export const accountSlice = createSlice({
    name: 'accounts',
    initialState: {
        byId: {},
    },
    reducers: {
        setAccounts: (state, action) => {
            const accounts = action.payload.json
            accounts.forEach((account) => {
                state.byId[`${account.id}`] = account
            })
        }
    }
});

export const {
    setAccounts
} = accountSlice.actions;

export default accountSlice.reducer;