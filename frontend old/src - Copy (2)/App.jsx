// Importing essential libraries
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // For styling (we'll set up Tailwind or custom CSS later)

// Home Page Component
function Homepage({ onLogin, onRegister }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
            <button
                onClick={onLogin}
                className="bg-white text-black px-6 py-3 rounded-lg shadow-md hover:bg-gray-200 mb-4"
            >
                Log In
            </button>
            <button
                onClick={onRegister}
                className="bg-gray-700 text-black px-6 py-3 rounded-lg shadow-md hover:bg-gray-600"
            >
                Register
            </button>
        </div>
    );
}

// Login Page Component
function LoginPage({ onSubmit }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit({ email, password });
                }}
                className="space-y-4"
            >
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-2 rounded bg-gray-700 text-white border-none focus:outline-none"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-4 py-2 rounded bg-gray-700 text-white border-none focus:outline-none"
                />
                <button
                    type="submit"
                    className="bg-white text-black px-6 py-3 rounded-lg shadow-md hover:bg-gray-200"
                >
                    Log In
                </button>
            </form>
        </div>
    );
}

// Register Page Component
function RegisterPage({ onSubmit }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit({ email, password });
                }}
                className="space-y-4"
            >
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-2 rounded bg-gray-700 text-white border-none focus:outline-none"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="px-4 py-2 rounded bg-gray-700 text-white border-none focus:outline-none"
                />
                <button
                    type="submit"
                    className="bg-gray-700 text-black px-6 py-3 rounded-lg shadow-md hover:bg-gray-600"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

// App Component
function App() {
    const [page, setPage] = useState("home"); // "home", "login", "register"
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
        return <Homepage onLogin={() => setPage("login")} onRegister={() => setPage("register")} />;
    }

    if (page === "login") {
        return <LoginPage onSubmit={handleLogin} />;
    }

    if (page === "register") {
        return <RegisterPage onSubmit={handleRegister} />;
    }

    return (
        <div className="h-screen bg-black text-white">
            {isLoggedIn && renderSettings()}
            <h1 className="text-center mt-10">Welcome to Your Dashboard</h1>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
