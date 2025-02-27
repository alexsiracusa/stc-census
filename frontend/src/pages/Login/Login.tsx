import React, {useEffect, useState} from "react";
import "./Login.css";
import useLogin from "../../hooks/useLogin.ts";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const Login = () => {
    const {login, loading, error, data} = useLogin()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayError, setError] = useState<string | null>(null);

    const account = useSelector((state) => state.accounts.user)
    const navigate = useNavigate()

    useEffect(() => {
        setError(error)
    }, [error]);

    useEffect(() => {
        if (account) {
            navigate('/projects')
        }
    }, [account, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        login(email, password)
    };


    return (
        <div className='login-container'>
            <div className="login-form">
                <h2>Login</h2>

                {displayError && <div className="error">{displayError}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
