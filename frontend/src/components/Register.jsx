import { useState } from "react";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("FACULTY");

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

        const userData = {
            username: username,
            password: password,
            role: role,
        };

        try {
            const response = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const data = await response.json();

            console.log("Registration response:", data);

            setSuccessMessage("Registration successful!");

            setUsername("");
            setPassword("");
            setRole("FACULTY");
        } catch (error) {
            console.error("Registration failed:", error);

            setErrorMessage(error.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2>Register</h2>

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

                <div>
                    <label>Role:</label>

                    <select
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                    >
                        <option value="FACULTY">Faculty</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}

export default Register;