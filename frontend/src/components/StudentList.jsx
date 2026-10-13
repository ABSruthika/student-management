import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

function StudentList({ refreshKey }) {
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
            setErrorMessage(error.message || "Failed to load students");
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
        setEditingStudent(null);
        setName("");
        setEmail("");
        setAge("");
        setCourse("");
        setErrorMessage("");
    }

    async function handleUpdate(event) {
        event.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        if (!name.trim() || !email.trim() || !age || !course.trim()) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        if (Number(age) < 1) {
            setErrorMessage("Age must be at least 1.");
            return;
        }

        setSaving(true);

        try {
            await apiRequest(`/students/${editingStudent.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    age: Number(age),
                    course: course.trim(),
                }),
            });

            setSuccessMessage("Student updated successfully!");
            setEditingStudent(null);

            await fetchStudents();
        } catch (error) {
            console.error("Failed to update student:", error);
            setErrorMessage(error.message || "Failed to update student.");
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
        setErrorMessage(error.message || "Failed to delete student.");
    }
}

    if (loading) {
        return <p>Loading students...</p>;
    }

    if (errorMessage && students.length === 0) {
        return <p role="alert">Error: {errorMessage}</p>;
    }

    return (
        <section>
            <h2>Student List</h2>

            {successMessage && <p>{successMessage}</p>}

            {errorMessage && (
                <p role="alert">Error: {errorMessage}</p>
            )}

            {students.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <table>
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
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(student)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(student)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {editingStudent && (
                <div>
                    <h3>Edit Student #{editingStudent.id}</h3>

                    <form onSubmit={handleUpdate}>
                        <div>
                            <label htmlFor="edit-name">Name:</label>
                            <input
                                id="edit-name"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="edit-email">Email:</label>
                            <input
                                id="edit-email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="edit-age">Age:</label>
                            <input
                                id="edit-age"
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
                            <label htmlFor="edit-course">Course:</label>
                            <input
                                id="edit-course"
                                value={course}
                                onChange={(event) =>
                                    setCourse(event.target.value)
                                }
                                required
                            />
                        </div>

                        <button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </section>
    );
}

export default StudentList;