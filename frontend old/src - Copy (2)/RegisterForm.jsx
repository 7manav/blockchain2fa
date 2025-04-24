// RegisterForm.jsx
import React, { useState } from "react";

function RegisterForm({ onRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => {
        onRegister(email, password); // Send to backend
    };

    return (
        <div className="space-y-4">
            <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-lg p-3 w-full"
            />
            <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded-lg p-3 w-full"
            />
            <button onClick={handleRegister} className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600">
                Register
            </button>
        </div>
    );
}

export default RegisterForm;
