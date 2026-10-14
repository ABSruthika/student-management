import { useEffect, useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import AddStudent from "./components/AddStudent";
import StudentList from "./components/StudentList";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("token"))
    );

    const [role, setRole] = useState(
        localStorage.getItem("role")
    );

    useEffect(() => {
        function handleUnauthorized() {
            setIsLoggedIn(false);
            setRole(null);
        }

        window.addEventListener("auth:unauthorized", handleUnauthorized);

        return () => {
            window.removeEventListener("auth:unauthorized", handleUnauthorized);
        };
    }, []);

    const [refreshKey, setRefreshKey] = useState(0);

    function handleLoginSuccess() {
        setRole(localStorage.getItem("role"));
        setIsLoggedIn(true);
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setRole(null);
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

                    {role === "ADMIN" && (
                        <AddStudent onStudentAdded={handleStudentAdded} />
                    )}

                    <StudentList refreshKey={refreshKey} role={role} />
                </>
            )}
        </div>
    );
}

export default App;