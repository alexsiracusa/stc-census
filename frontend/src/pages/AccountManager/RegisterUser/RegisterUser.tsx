import './RegisterUser.css';

import useRegisterUser from '../../../hooks/useRegisterUser.ts';
import { useState } from 'react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const { register, loading, error } = useRegisterUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(email, firstName, lastName, password);
        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
    };

    return (
        <div className='register-page'>
            <h1>Register User</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Register;
