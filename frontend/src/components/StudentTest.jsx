import { useState } from "react";
import { apiRequest } from "../api/api";

function StudentTest() {
    const [students, setStudents] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    async function fetchStudents() {
        setErrorMessage("");

        try {
            const response = await apiRequest("/students");

            const data = await response.json();

            console.log("Students response:", data);

            setStudents(data);
        } catch (error) {
            console.error("Failed to fetch students:", error);

            setErrorMessage(error.message);
        }
    }

    return (
        <div>
            <h2>Student API Test</h2>

            <button onClick={fetchStudents}>
                Get Students
            </button>

            {errorMessage && (
                <p>{errorMessage}</p>
            )}

            {students.map((student) => (
                <div key={student.id}>
                    <p>
                        {student.id} - {student.name}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default StudentTest;