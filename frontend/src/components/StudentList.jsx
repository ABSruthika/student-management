
import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

function StudentList({ refreshKey }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

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

    if (loading) {
        return <p>Loading students...</p>;
    }

    if (errorMessage) {
        return <p role="alert">Error: {errorMessage}</p>;
    }

    return (
        <section>
            <h2>Student List</h2>

            {students.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>

                    <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}

export default StudentList;
