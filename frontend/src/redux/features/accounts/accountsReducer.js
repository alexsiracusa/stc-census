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
        user: {
            id: 1
            email: "alexander.siracusa@gmail.com",
            first_name: "alexander",
            last_name: "siracusa"
        }
    }
}
 */

export const accountSlice = createSlice({
    name: 'accounts',
    initialState: {
        byId: {},
        user: null,
    },
    reducers: {
        setAccounts: (state, action) => {
            const accounts = action.payload
            accounts.forEach((account) => {
                state.byId[`${account.id}`] = account
            })
        },
        addAccount: (state, action) => {
            const account = action.payload
            const oldAccount = state.byId[`${account.id}`]
            state.byId[`${account.id}`] = {...oldAccount, ...account}
        },
        setUser: (state, action) => {
            state.user = action.payload
        },
    }
});

export const {
    setAccounts,
    addAccount,
    setUser,
} = accountSlice.actions;

export default accountSlice.reducer;