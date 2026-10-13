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

        if (Number(age) < 1) {
            setErrorMessage("Age must be at least 1.");
            return;
        }

        setLoading(true);

        try {
            const response = await apiRequest("/students", {
                method: "POST",
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    age: Number(age),
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

            {successMessage && <p>{successMessage}</p>}
            {errorMessage && (
                <p role="alert">Error: {errorMessage}</p>
            )}

            <form onSubmit={handleSubmit}>
                <div>
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

                <div>
                    <label htmlFor="student-email">Email:</label>
                    <input
                        id="student-email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="student-age">Age:</label>
                    <input
                        id="student-age"
                        type="number"
                        min="1"
                        value={age}
                        onChange={(event) =>
                            setAge(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
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

                <button type="submit" disabled={loading}>
                    {loading ? "Adding..." : "Add Student"}
                </button>
            </form>
        </section>
    );
}

export default AddStudent;