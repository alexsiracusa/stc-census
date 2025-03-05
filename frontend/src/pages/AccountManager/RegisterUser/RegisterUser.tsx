import './RegisterUser.css'; // Include any styles you want for the Register component
import useRegisterUser from '../../../hooks/useRegisterUser.ts'; // Adjust the import path as necessary
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
        // Optionally reset form fields or provide success feedback
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
                {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
            </form>
        </div>
    );
};

export default Register;
