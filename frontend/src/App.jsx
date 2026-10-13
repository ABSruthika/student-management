import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import AddStudent from "./components/AddStudent";
import StudentList from "./components/StudentList";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("token"))
    );

    const [refreshKey, setRefreshKey] = useState(0);

    function handleLoginSuccess() {
        setIsLoggedIn(true);
    }

    function handleLogout() {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    }

    function handleStudentAdded() {
        setRefreshKey((previousKey) => previousKey + 1);
    }

    return (
        <div>
            <h1>Student Management System</h1>

            {!isLoggedIn ? (
                <>
                    <Register />
                    <Login onLoginSuccess={handleLoginSuccess} />
                </>
            ) : (
                <>
                    <p>You are logged in!</p>

                    <button onClick={handleLogout}>
                        Logout
                    </button>

                    <AddStudent
                        onStudentAdded={handleStudentAdded}
                    />

                    <StudentList refreshKey={refreshKey} />
                </>
            )}
        </div>
    );
}

export default App;