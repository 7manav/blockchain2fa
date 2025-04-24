import React, { useState } from "react";
import Homepage from "./Homepage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

function App() {
    const [page, setPage] = useState("home"); // "home", "login", "register", "dashboard"
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (credentials) => {
        console.log("Logging in with", credentials);
        setIsLoggedIn(true);
        setPage("dashboard");
    };

    const handleRegister = (credentials) => {
        console.log("Registering with", credentials);
        setIsLoggedIn(true);
        setPage("dashboard");
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setPage("home");
    };

    const renderSettings = () => (
        <div className="absolute top-4 right-4">
            <div className="relative group">
                <button className="text-white">⚙</button>
                <div className="hidden group-hover:block absolute right-0 mt-2 bg-gray-700 rounded shadow-lg">
                    <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-white hover:bg-gray-600"
                    >
                        Log Out
                    </button>
                    <button
                        onClick={() => alert("Setup 2FA")}
                        className="block px-4 py-2 text-white hover:bg-gray-600"
                    >
                        Setup 2FA
                    </button>
                </div>
            </div>
        </div>
    );

    if (page === "home") {
        return (
            <Homepage
                onLogin={() => setPage("login")}
                onRegister={() => setPage("register")}
            />
        );
    }

    if (page === "login") {
        return <LoginPage onSubmit={handleLogin} />;
    }

    if (page === "register") {
        return <RegisterPage onSubmit={handleRegister} />;
    }

    if (page === "dashboard") {
        return (
            <div className="h-screen bg-black text-white">
                {isLoggedIn && renderSettings()}
                <h1 className="text-center mt-10">Welcome to Your Dashboard</h1>
            </div>
        );
    }
}

export default App;
