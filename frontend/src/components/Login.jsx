import { useState } from "react";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [validationError, setValidationError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");
        setValidationError("");

        if (username.trim().length < 3) {
            setValidationError("Username must be at least 3 characters");
            return;
        }

        if (password.length < 6) {
            setValidationError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        const loginData = {
            username: username.trim(),
            password: password,
        };

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Login failed");
            }

            const data = await response.json();

            console.log("Login response:", data);
            console.log("JWT token:", data.token);

            localStorage.setItem("token", data.token);

            setSuccessMessage("Login successful!");

            setUsername("");
            setPassword("");
        } catch (error) {
            console.error("Login failed:", error);

            setErrorMessage(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2>Login</h2>

            {successMessage && (
                <p>{successMessage}</p>
            )}

            {errorMessage && (
                <p>{errorMessage}</p>
            )}

            {validationError && (
                <p>{validationError}</p>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>

                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>

                <div>
                    <label>Password:</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;