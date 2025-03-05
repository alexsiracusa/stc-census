import './AccountManager.css';
import { useSelector } from "react-redux";
import RegisterUser from './RegisterUser/RegisterUser.tsx'; // Ensure the path is correctly set
import { useState } from 'react';
import useUpdateAccount from "../../hooks/useUpdateAccount.ts";

const AccountManager = () => {
    const account = useSelector((state) => state.accounts.user);
    const [showRegistration, setShowRegistration] = useState(false);

    const toggleRegistrationForm = () => {
        setShowRegistration((prev) => !prev);
    };

    return (
        <div className='account-manager-page'>
            <h1>Account Manager</h1>
            {account ? (
                <div className="account-details">
                    <p><strong>Email:</strong> {account.email}</p>
                    <p><strong>First Name:</strong> {account.first_name || 'N/A'}</p>
                    <p><strong>Last Name:</strong> {account.last_name || 'N/A'}</p>
                    <button onClick={toggleRegistrationForm}>
                        {showRegistration ? 'Hide Registration Form' : 'Show Registration Form'}
                    </button>
                    {showRegistration && <RegisterUser />}
                </div>
            ) : (
                <>
                    <p>No account information available. Please register.</p>
                </>
            )}
        </div>
    );
};

export default AccountManager;
