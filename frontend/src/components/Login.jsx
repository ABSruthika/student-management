
import { useState } from "react";

function Login({ onLoginSuccess, onSwitchToRegister }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [validationError, setValidationError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        if (loading) return;

        setSuccessMessage("");
        setErrorMessage("");
        setValidationError("");

        if (username.trim().length < 3) {
            setValidationError(
                "Username must be at least 3 characters."
            );
            return;
        }

        if (password.length < 6) {
            setValidationError(
                "Password must be at least 6 characters."
            );
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8080/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username.trim(),
                        password,
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Login failed.");
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            setSuccessMessage("Login successful!");

            if (onLoginSuccess) {
                onLoginSuccess();
            }

            setUsername("");
            setPassword("");
        } catch (error) {
            console.error("Login failed:", error);
            setErrorMessage(
                error.message ||
                "Unable to log in. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-form">
            <h2>Welcome back</h2>
            <p className="auth-description">
                Enter your credentials to access your account.
            </p>

            {successMessage && (
                <p className="form-message success" role="status">
                    {successMessage}
                </p>
            )}

            {errorMessage && (
                <p className="form-message error" role="alert">
                    {errorMessage}
                </p>
            )}

            {validationError && (
                <p className="form-message error" role="alert">
                    {validationError}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="login-username">Username</label>
                    <input
                        id="login-username"
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                        required
                        minLength={3}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                        minLength={6}
                    />
                </div>

                <button
                    className="button button-primary submit-button"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <p className="auth-switch">
                Don't have an account?{" "}
                <button
                    type="button"
                    className="text-button"
                    onClick={onSwitchToRegister}
                >
                    Register
                </button>
            </p>
        </div>
    );
}

export default Login;
