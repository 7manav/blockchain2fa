import React, { useState } from "react";

function Homepage({ onLogin, onRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // Send login request to backend
        onLogin(email, password);
    };

    const handleRegister = () => {
        // Send register request to backend
        onRegister(email, password);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">Welcome to Blockchain 2FA</h1>
            <div className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded-lg p-3 w-full"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded-lg p-3 w-full"
                />
                <button
                    onClick={handleLogin}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600"
                >
                    Login
                </button>
                <button
                    onClick={handleRegister}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600"
                >
                    Register
                </button>
            </div>
        </div>
    );
}

export default Homepage;
