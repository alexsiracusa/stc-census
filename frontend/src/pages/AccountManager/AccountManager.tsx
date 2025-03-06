import './AccountManager.css';
import {useSelector} from "react-redux";
import RegisterUser from './RegisterUser/RegisterUser.tsx';
import {useState} from 'react';
import useFetchAccounts from "../../hooks/useFetchAccounts.ts";
import NameEditor from "../../components/GenericComponents/NameEditor/NameEditor.tsx";
import useUpdateAccount from "../../hooks/useUpdateAccount.ts";

const AccountManager = () => {
    const user = useSelector((state) => state.accounts.user)
    const accounts = useSelector((state) => state.accounts.byId)
    const [showRegistration, setShowRegistration] = useState(false);

    const {updateAccount, updateLoading, updateError, updateData} = useUpdateAccount()
    const {loading, error, date} = useFetchAccounts()

    const toggleRegistrationForm = () => {
        setShowRegistration((prev) => !prev);
    };

    if (!accounts || Object.values(accounts).length === 0) {
        return <>Loading</>
    }

    return (
        <div className='account-manager-page'>
            <div className='account-manager-container'>
                <h1>Account Manager</h1>
                <div className='account-list'>
                    {Object.values(accounts).map((account) => (
                        <div className='account-row' key={account.id}>
                            <NameEditor
                                name={account.email}
                                className='email'
                                setName={(value) => {
                                    updateAccount(account.id, {
                                        email: value
                                    })
                                }}
                            />
                            <NameEditor
                                name={account.first_name}
                                className='name'
                                setName={(value) => {
                                    updateAccount(account.id, {
                                        first_name: value
                                    })
                                }}
                            />
                            <NameEditor
                                name={account.last_name}
                                className='name'
                                setName={(value) => {
                                    updateAccount(account.id, {
                                        last_name: value
                                    })
                                }}
                            />
                            <NameEditor
                                name={''}
                                className='password'
                                placeholder={"Reset Password"}
                                setName={(value) => {
                                    updateAccount(account.id, {
                                        password: value
                                    })
                                }}
                            />
                            <input
                                className='admin'
                                checked={account.admin}
                                type='checkbox'
                                onChange={(e) => {
                                    if (account.id === user.id) { return }
                                    updateAccount(account.id, {
                                        admin: e.target.checked
                                    })
                                }}
                            />
                        </div>
                    ))}
                </div>

                <button onClick={toggleRegistrationForm}>
                    {showRegistration ? 'Hide Registration Form' : 'Show Registration Form'}
                </button>
                {showRegistration && <RegisterUser/>}
            </div>
        </div>
    );
};

export default AccountManager;
