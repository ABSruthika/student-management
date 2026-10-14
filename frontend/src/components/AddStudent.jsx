import { useState } from "react";
import { apiRequest } from "../api/api";

function AddStudent({ onStudentAdded }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [course, setCourse] = useState("");

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        if (loading) {
            return;
        }

        setSuccessMessage("");
        setErrorMessage("");

        if (
            !name.trim() ||
            !email.trim() ||
            !age ||
            !course.trim()
        ) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        const numericAge = Number(age);

        if (!Number.isInteger(numericAge) || numericAge < 1) {
            setErrorMessage("Age must be a positive whole number.");
            return;
        }

        setLoading(true);

        try {
            const response = await apiRequest("/students", {
                method: "POST",
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    age: numericAge,
                    course: course.trim(),
                }),
            });

            const newStudent = await response.json();

            setSuccessMessage("Student added successfully!");
            setName("");
            setEmail("");
            setAge("");
            setCourse("");

            if (onStudentAdded) {
                onStudentAdded(newStudent);
            }
        } catch (error) {
            console.error("Failed to add student:", error);

            setErrorMessage(
                error.message || "Failed to add student."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section>
            <h2>Add Student</h2>

            {successMessage && (
                <p className="form-message success" role="status">
                    {successMessage}
                </p>
            )}

            {errorMessage && (
                <p className="form-message error" role="alert">
                    Error: {errorMessage}
                </p>
            )}

            <form
                className="student-form"
                onSubmit={handleSubmit}
            >
                <div className="form-field">
                    <label htmlFor="student-name">Name:</label>
                    <input
                        id="student-name"
                        type="text"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="student-email">Email:</label>
                    <input
                        id="student-email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                        autoComplete="email"
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="student-age">Age:</label>
                    <input
                        id="student-age"
                        type="number"
                        min="1"
                        step="1"
                        value={age}
                        onChange={(event) =>
                            setAge(event.target.value)
                        }
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="student-course">Course:</label>
                    <input
                        id="student-course"
                        type="text"
                        value={course}
                        onChange={(event) =>
                            setCourse(event.target.value)
                        }
                        required
                    />
                </div>

                <button
                    className="button button-primary submit-button"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Student"}
                </button>
            </form>
        </section>
    );
}

export default AddStudent;