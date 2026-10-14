
import { useState } from "react";

function Register({ onSwitchToLogin }) {
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
                "http://localhost:8080/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username.trim(),
                        password,
                        role: "FACULTY",
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    errorText || "Registration failed."
                );
            }

            setSuccessMessage(
                "Registration successful! You can now log in."
            );

            setUsername("");
            setPassword("");
        } catch (error) {
            console.error("Registration failed:", error);
            setErrorMessage(
                error.message ||
                "Unable to register. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-form">
            <h2>Create an account</h2>
            <p className="auth-description">
                Register to access the student portal.
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
                    <label htmlFor="register-username">Username</label>
                    <input
                        id="register-username"
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
                    <label htmlFor="register-password">Password</label>
                    <input
                        id="register-password"
                        type="password"
                        autoComplete="new-password"
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
                    {loading ? "Creating account..." : "Create account"}
                </button>
            </form>

            <p className="auth-switch">
                Already have an account?{" "}
                <button
                    type="button"
                    className="text-button"
                    onClick={onSwitchToLogin}
                >
                    Login
                </button>
            </p>
        </div>
    );
}

export default Register;
