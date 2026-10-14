import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

function StudentList({ refreshKey, role }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [editingStudent, setEditingStudent] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [course, setCourse] = useState("");

    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchStudents();
    }, [refreshKey]);

    async function fetchStudents() {
        try {
            setLoading(true);
            setErrorMessage("");

            const response = await apiRequest("/students");
            const data = await response.json();

            setStudents(data);
        } catch (error) {
            console.error("Failed to fetch students:", error);
            setErrorMessage(
                error.message || "Failed to load students."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(student) {
        setEditingStudent(student);
        setName(student.name);
        setEmail(student.email);
        setAge(String(student.age));
        setCourse(student.course);
        setErrorMessage("");
        setSuccessMessage("");
    }

    function handleCancelEdit() {
        if (saving) {
            return;
        }

        setEditingStudent(null);
        setName("");
        setEmail("");
        setAge("");
        setCourse("");
        setErrorMessage("");
    }

    async function handleUpdate(event) {
        event.preventDefault();

        if (saving || !editingStudent) {
            return;
        }

        setErrorMessage("");
        setSuccessMessage("");

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
            setErrorMessage(
                "Age must be a positive whole number."
            );
            return;
        }

        setSaving(true);

        try {
            await apiRequest(`/students/${editingStudent.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    age: numericAge,
                    course: course.trim(),
                }),
            });

            setEditingStudent(null);
            setName("");
            setEmail("");
            setAge("");
            setCourse("");
            setSuccessMessage("Student updated successfully!");

            await fetchStudents();
        } catch (error) {
            console.error("Failed to update student:", error);
            setErrorMessage(
                error.message || "Failed to update student."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(student) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${student.name}?`
        );

        if (!confirmed) {
            return;
        }

        setErrorMessage("");
        setSuccessMessage("");

        try {
            await apiRequest(`/students/${student.id}`, {
                method: "DELETE",
            });

            setSuccessMessage("Student deleted successfully!");

            if (editingStudent?.id === student.id) {
                handleCancelEdit();
            }

            await fetchStudents();
        } catch (error) {
            console.error("Failed to delete student:", error);
            setErrorMessage(
                error.message || "Failed to delete student."
            );
        }
    }

    if (loading) {
        return <p>Loading students...</p>;
    }

    return (
        <section className="student-list-section">
            <h2>Student List</h2>

            {successMessage && (
                <p className="form-message success" role="status">
                    {successMessage}
                </p>
            )}

            {errorMessage && !editingStudent && (
                <p className="form-message error" role="alert">
                    Error: {errorMessage}
                </p>
            )}

            {errorMessage && editingStudent && (
                <p className="form-message error" role="alert">
                    Error: {errorMessage}
                </p>
            )}

            {errorMessage && !students.length ? null : students.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <div className="student-table-wrapper">
                    <table className="student-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Course</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.age}</td>
                                    <td>{student.course}</td>
                                    <td>
                                        <div className="student-actions">
                                            {(role === "ADMIN" ||
                                                role === "FACULTY") && (
                                                <button
                                                    className="button button-outline"
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(student)
                                                    }
                                                >
                                                    Edit
                                                </button>
                                            )}

                                            {role === "ADMIN" && (
                                                <button
                                                    className="button button-danger"
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(student)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editingStudent && (
                <div
                    className="modal-overlay"
                    onClick={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !saving
                        ) {
                            handleCancelEdit();
                        }
                    }}
                >
                    <div
                        className="edit-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-student-title"
                    >
                        <div className="modal-header">
                            <div>
                                <h3 id="edit-student-title">
                                    Edit Student
                                </h3>
                                <p>
                                    Update the details for student #
                                    {editingStudent.id}
                                </p>
                            </div>

                            <button
                                className="modal-close-button"
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={saving}
                                aria-label="Close edit dialog"
                            >
                                &times;
                            </button>
                        </div>

                        <form
                            className="student-form"
                            onSubmit={handleUpdate}
                        >
                            {errorMessage && (
                                <p
                                    className="form-message error"
                                    role="alert"
                                >
                                    Error: {errorMessage}
                                </p>
                            )}

                            <div className="form-field">
                                <label htmlFor="edit-name">
                                    Name
                                </label>
                                <input
                                    id="edit-name"
                                    type="text"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="edit-email">
                                    Email
                                </label>
                                <input
                                    id="edit-email"
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
                                <label htmlFor="edit-age">
                                    Age
                                </label>
                                <input
                                    id="edit-age"
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
                                <label htmlFor="edit-course">
                                    Course
                                </label>
                                <input
                                    id="edit-course"
                                    type="text"
                                    value={course}
                                    onChange={(event) =>
                                        setCourse(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="student-form-actions">
                                <button
                                    className="button button-outline"
                                    type="button"
                                    onClick={handleCancelEdit}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="button button-primary"
                                    type="submit"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

export default StudentList;