// Homepage.jsx
import React from "react";

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
                className="bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600"
            >
                Register
            </button>
        </div>
    );
}

export default Homepage;
