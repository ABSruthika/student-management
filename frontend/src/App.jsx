
import { useEffect, useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import AddStudent from "./components/AddStudent";
import StudentList from "./components/StudentList";
import "./App.css";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem("token"))
    );

    const [role, setRole] = useState(
        localStorage.getItem("role")
    );

    const [authView, setAuthView] = useState("login");
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        function handleUnauthorized() {
            setIsLoggedIn(false);
            setRole(null);
            setAuthView("login");
        }

        window.addEventListener(
            "auth:unauthorized",
            handleUnauthorized
        );

        return () => {
            window.removeEventListener(
                "auth:unauthorized",
                handleUnauthorized
            );
        };
    }, []);

    function handleLoginSuccess() {
        setRole(localStorage.getItem("role"));
        setIsLoggedIn(true);
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setRole(null);
        setIsLoggedIn(false);
        setAuthView("login");
    }

    function handleStudentAdded() {
        setRefreshKey((previousKey) => previousKey + 1);
    }

    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="header-brand">
                    <div className="brand-icon">S</div>
                    <div>
                        <h1>Student Management</h1>
                        <p>Manage student records with ease</p>
                    </div>
                </div>

                {isLoggedIn && (
                    <div className="header-user">
                        <span className="role-badge">{role}</span>
                        <button
                            className="button button-outline"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </header>

            <main className="app-main">
                {!isLoggedIn ? (
                    <section className="auth-layout">
                        <div className="auth-intro">
                            <p className="eyebrow">STUDENT PORTAL</p>
                            <h2>
                                A smarter way to manage student records.
                            </h2>
                            <p>
                                Sign in to access your dashboard and
                                manage student information securely.
                            </p>
                        </div>

                        <div className="auth-card">
                            <div className="auth-tabs" role="tablist">
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={authView === "login"}
                                    className={
                                        authView === "login"
                                            ? "auth-tab active"
                                            : "auth-tab"
                                    }
                                    onClick={() => setAuthView("login")}
                                >
                                    Login
                                </button>

                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={authView === "register"}
                                    className={
                                        authView === "register"
                                            ? "auth-tab active"
                                            : "auth-tab"
                                    }
                                    onClick={() => setAuthView("register")}
                                >
                                    Register
                                </button>
                            </div>

                            {authView === "login" ? (
                                <Login
                                    onLoginSuccess={handleLoginSuccess}
                                    onSwitchToRegister={() =>
                                        setAuthView("register")
                                    }
                                />
                            ) : (
                                <Register
                                    onSwitchToLogin={() =>
                                        setAuthView("login")
                                    }
                                />
                            )}
                        </div>
                    </section>
                ) : (
                    <section className="dashboard-section">
                        <div className="page-heading">
                            <p className="eyebrow">
                                {role === "ADMIN"
                                    ? "ADMIN DASHBOARD"
                                    : "FACULTY DASHBOARD"}
                            </p>
                            <h2>Student Management Dashboard</h2>
                            <p>
                                View and manage student records from
                                one place.
                            </p>
                        </div>

                        <div className="dashboard-content">
                            {role === "ADMIN" && (
                                <div className="content-card">
                                    <AddStudent
                                        onStudentAdded={handleStudentAdded}
                                    />
                                </div>
                            )}

                            <div className="content-card student-list-card">
                                <StudentList
                                    refreshKey={refreshKey}
                                    role={role}
                                />
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <footer className="app-footer">
                Student Management System
            </footer>
        </div>
    );
}

export default App;
