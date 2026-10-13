import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import AddStudent from "./components/AddStudent";
import StudentList from "./components/StudentList";

function App() {
    const [refreshKey, setRefreshKey] = useState(0);

    function handleStudentAdded() {
        setRefreshKey((previousKey) => previousKey + 1);
    }

    return (
        <div>
            <h1>Student Management System</h1>

            <Register />
            <Login />

            <AddStudent onStudentAdded={handleStudentAdded} />

            <StudentList refreshKey={refreshKey} />
        </div>
    );
}

export default App;