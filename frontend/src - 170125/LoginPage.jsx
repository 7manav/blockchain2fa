// LoginPage.jsx
import React, { useState } from "react";

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

export default LoginPage;
