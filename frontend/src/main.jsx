// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // For Tailwind styles
import App from "./App"; // Import the default export from App.jsx

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
