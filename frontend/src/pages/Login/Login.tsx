import React, { useState } from "react";
import "./Login.css";
import useFetchUser from "../../hooks/useFetchUser";

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useFetchUser(userId);

    const validateCredentials = async (email: string, password: string) => {
        try {
            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const responseBody = await response.json();

            if (!response.ok) {
                const errorMessage =
                    response.status === 401
                        ? "Invalid email or password. Please try again."
                        : `Server error: ${responseBody.detail || response.status}`;
                throw new Error(errorMessage);
            }

            if (responseBody && responseBody.id) {
                return responseBody.id;
            }

            throw new Error("Invalid email or password. Please check your credentials.");
        } catch (err: any) {
            throw new Error(err.message || "Network error. Please try again later.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError(null);

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);

        try {
            const fetchedUserId = await validateCredentials(email, password);

            setUserId(fetchedUserId);
            onLogin();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="login-container">
            <h2>Login</h2>

            {error && <div className="error">{error}</div>}

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
    );
};

export default Login;
