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

    const [username, setUsername] = useState(
        localStorage.getItem("username") || ""
    );

    const [authView, setAuthView] = useState("login");
    const [activePage, setActivePage] = useState("dashboard");
    const [refreshKey, setRefreshKey] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        function handleUnauthorized() {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("username");

            setIsLoggedIn(false);
            setRole(null);
            setUsername("");
            setAuthView("login");
            setActivePage("dashboard");
            setSidebarOpen(false);
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
        setUsername(localStorage.getItem("username") || "");
        setIsLoggedIn(true);
        setActivePage("dashboard");
    }

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");

        setRole(null);
        setUsername("");
        setIsLoggedIn(false);
        setAuthView("login");
        setActivePage("dashboard");
        setSidebarOpen(false);
    }

    function handleStudentAdded() {
        setRefreshKey((previousKey) => previousKey + 1);
    }

    function navigateTo(page) {
        setActivePage(page);
        setSidebarOpen(false);
    }

    const pageDetails = {
        dashboard: {
            eyebrow: "OVERVIEW",
            title: "Dashboard",
            description:
                "Welcome back! Here's your student management workspace.",
        },
        students: {
            eyebrow: "STUDENT MANAGEMENT",
            title: "Students",
            description: "View, update, and manage student records.",
        },
        addStudent: {
            eyebrow: "STUDENT MANAGEMENT",
            title: "Add Student",
            description:
                "Enter the details below to create a student record.",
        },
    };

    const currentPage =
        pageDetails[activePage] || pageDetails.dashboard;

    return (
        <div
            className={`app-shell ${
                isLoggedIn ? "workspace-shell" : ""
            }`}
        >
            {!isLoggedIn ? (
                <>
                    <header className="app-header">
                        <div className="header-brand">
                            <div className="brand-icon">S</div>
                            <div>
                                <h1>Student Management</h1>
                                <p>Manage student records with ease</p>
                            </div>
                        </div>
                    </header>

                    <main className="app-main auth-main">
                        <section className="auth-layout">
                            <div className="auth-intro">
                                <p className="eyebrow">STUDENT PORTAL</p>
                                <h2>
                                    A smarter way to manage student
                                    records.
                                </h2>
                                <p>
                                    Sign in to access your dashboard and
                                    manage student information securely.
                                </p>
                            </div>

                            <div className="auth-card">
                                <div
                                    className="auth-tabs"
                                    role="tablist"
                                >
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={
                                            authView === "login"
                                        }
                                        className={
                                            authView === "login"
                                                ? "auth-tab active"
                                                : "auth-tab"
                                        }
                                        onClick={() =>
                                            setAuthView("login")
                                        }
                                    >
                                        Login
                                    </button>

                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={
                                            authView === "register"
                                        }
                                        className={
                                            authView === "register"
                                                ? "auth-tab active"
                                                : "auth-tab"
                                        }
                                        onClick={() =>
                                            setAuthView("register")
                                        }
                                    >
                                        Register
                                    </button>
                                </div>

                                {authView === "login" ? (
                                    <Login
                                        onLoginSuccess={
                                            handleLoginSuccess
                                        }
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
                    </main>

                    <footer className="app-footer">
                        Student Management System
                    </footer>
                </>
            ) : (
                <div className="workspace-layout">
                    {sidebarOpen && (
                        <button
                            type="button"
                            className="sidebar-backdrop"
                            aria-label="Close navigation menu"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    <aside
                        className={`app-sidebar ${
                            sidebarOpen ? "sidebar-open" : ""
                        }`}
                    >
                        <div className="sidebar-brand">
                            <div className="brand-icon">S</div>
                            <div>
                                <h1>
                                    Student<span>Hub</span>
                                </h1>
                                <p>Management portal</p>
                            </div>
                        </div>

                        <div className="sidebar-section-label">
                            WORKSPACE
                        </div>

                        <nav
                            className="sidebar-nav"
                            aria-label="Main navigation"
                        >
                            <button
                                type="button"
                                className={`nav-item ${
                                    activePage === "dashboard"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    navigateTo("dashboard")
                                }
                                aria-current={
                                    activePage === "dashboard"
                                        ? "page"
                                        : undefined
                                }
                            >
                                <span
                                    className="nav-icon"
                                    aria-hidden="true"
                                >
                                    <svg viewBox="0 0 24 24">
                                        <rect
                                            x="3"
                                            y="3"
                                            width="7"
                                            height="7"
                                            rx="1.5"
                                        />
                                        <rect
                                            x="14"
                                            y="3"
                                            width="7"
                                            height="7"
                                            rx="1.5"
                                        />
                                        <rect
                                            x="14"
                                            y="14"
                                            width="7"
                                            height="7"
                                            rx="1.5"
                                        />
                                        <rect
                                            x="3"
                                            y="14"
                                            width="7"
                                            height="7"
                                            rx="1.5"
                                        />
                                    </svg>
                                </span>
                                <span>Dashboard</span>
                            </button>

                            <button
                                type="button"
                                className={`nav-item ${
                                    activePage === "students"
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    navigateTo("students")
                                }
                                aria-current={
                                    activePage === "students"
                                        ? "page"
                                        : undefined
                                }
                            >
                                <span
                                    className="nav-icon"
                                    aria-hidden="true"
                                >
                                    <svg viewBox="0 0 24 24">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle
                                            cx="10"
                                            cy="7"
                                            r="4"
                                        />
                                        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </span>
                                <span>Students</span>
                            </button>

                            {role === "ADMIN" && (
                                <button
                                    type="button"
                                    className={`nav-item ${
                                        activePage === "addStudent"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        navigateTo("addStudent")
                                    }
                                    aria-current={
                                        activePage === "addStudent"
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    <span
                                        className="nav-icon"
                                        aria-hidden="true"
                                    >
                                        <svg viewBox="0 0 24 24">
                                            <circle
                                                cx="10"
                                                cy="8"
                                                r="4"
                                            />
                                            <path d="M3 21v-2a7 7 0 0 1 14 0v2M19 8v6M16 11h6" />
                                        </svg>
                                    </span>
                                    <span>Add Student</span>
                                </button>
                            )}
                        </nav>

                        <div className="sidebar-bottom">
                            <div className="sidebar-profile">
                                <div className="profile-avatar">
                                    {(
                                        username ||
                                        "U"
                                    ).charAt(0).toUpperCase()}
                                </div>

                                <div className="profile-info">
                                    <strong>
                                        {username || "User"}
                                    </strong>
                                    <span>{role}</span>
                                </div>

                                <button
                                    type="button"
                                    className="profile-logout"
                                    onClick={handleLogout}
                                    aria-label="Log out"
                                    title="Log out"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path d="M10 17l5-5-5-5M15 12H3" />
                                        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </aside>

                    <div className="workspace-main">
                        <header className="workspace-topbar">
                            <div className="topbar-left">
                                <button
                                    type="button"
                                    className="menu-toggle"
                                    onClick={() =>
                                        setSidebarOpen(!sidebarOpen)
                                    }
                                    aria-label="Toggle navigation menu"
                                    aria-expanded={sidebarOpen}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>

                                <div className="breadcrumb">
                                    <span>Workspace</span>
                                    <span className="breadcrumb-divider">
                                        /
                                    </span>
                                    <strong>
                                        {currentPage.title}
                                    </strong>
                                </div>
                            </div>

                            <div className="topbar-user">
                                <div className="topbar-user-text">
                                    <strong>
                                        {username || "User"}
                                    </strong>
                                </div>

                                <div className="topbar-avatar">
                                    {(
                                        username ||
                                        "U"
                                    ).charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </header>

                        <main className="workspace-content">
                            <div className="page-heading">
                                <p className="eyebrow">
                                    {currentPage.eyebrow}
                                </p>
                                <h2>{currentPage.title}</h2>
                                <p>{currentPage.description}</p>
                            </div>

                            {activePage === "dashboard" && (
                                <section className="dashboard-welcome">
                                    <div className="welcome-copy">
                                        <span className="welcome-label">
                                            YOUR WORKSPACE
                                        </span>

                                        <h3>
                                            {role === "ADMIN"
                                                ? "Manage your student records"
                                                : "Stay on top of student records"}
                                        </h3>

                                        <p>
                                            {role === "ADMIN"
                                                ? "Add students, review records, and keep student information organized from one place."
                                                : "View student information and update records you have permission to manage."}
                                        </p>

                                        <div className="welcome-actions">
                                            <button
                                                type="button"
                                                className="button button-primary"
                                                onClick={() =>
                                                    navigateTo("students")
                                                }
                                            >
                                                View Students
                                                <span aria-hidden="true">
                                                    →
                                                </span>
                                            </button>

                                            {role === "ADMIN" && (
                                                <button
                                                    type="button"
                                                    className="button button-outline"
                                                    onClick={() =>
                                                        navigateTo(
                                                            "addStudent"
                                                        )
                                                    }
                                                >
                                                    <span aria-hidden="true">
                                                        +
                                                    </span>
                                                    Add Student
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className="welcome-illustration"
                                        aria-hidden="true"
                                    >
                                        <div className="illustration-circle circle-one" />
                                        <div className="illustration-circle circle-two" />

                                        <div className="illustration-card">
                                            <div className="illustration-card-top">
                                                <span />
                                                <span />
                                                <span />
                                            </div>

                                            <div className="illustration-person">
                                                <div className="illustration-person-avatar" />
                                                <div className="illustration-lines">
                                                    <span />
                                                    <span />
                                                </div>
                                            </div>

                                            <div className="illustration-person">
                                                <div className="illustration-person-avatar second" />
                                                <div className="illustration-lines">
                                                    <span />
                                                    <span />
                                                </div>
                                            </div>

                                            <div className="illustration-person">
                                                <div className="illustration-person-avatar third" />
                                                <div className="illustration-lines">
                                                    <span />
                                                    <span />
                                                </div>
                                            </div>

                                            <div className="illustration-check">
                                                ✓
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {activePage === "students" && (
                                <section className="content-card student-list-card">
                                    <StudentList
                                        refreshKey={refreshKey}
                                        role={role}
                                    />
                                </section>
                            )}

                            {activePage === "addStudent" &&
                                role === "ADMIN" && (
                                    <section className="content-card add-student-card">
                                        <AddStudent
                                            onStudentAdded={
                                                handleStudentAdded
                                            }
                                        />
                                    </section>
                                )}
                        </main>

                        <footer className="workspace-footer">
                            <span>Student Management System</span>
                            <span>
                                Secure student records workspace
                            </span>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;