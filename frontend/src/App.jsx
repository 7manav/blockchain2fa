import React, { useState } from "react";
import Homepage from "./Homepage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import Setup2FA from "./Setup2FA";
//import SignWalletPage from "./SignWalletPage"; // New page to handle wallet signing

function App() {
  const [page, setPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState(null);

  const handleRegister = async (credentials) => {
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true);
        setLoggedInUserEmail(credentials.email);
        setPage("dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true);
        setLoggedInUserEmail(data.email); // Ensure email is set here
        setPage(data.is2faEnabled ? "signWallet" : "dashboard"); // Redirect to SignWallet page if 2FA enabled
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUserEmail(null);
    setPage("home");
  };

  const renderSettings = () => (
    <div className="absolute top-4 right-4 group">
      <button className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded inline-flex items-center">
        <span className="mr-1">Settings ⚙</span>
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </button>
      <ul className="dropdown-menu absolute hidden group-hover:block text-gray-700 dark:text-gray-300 pt-1">
        <li>
          <a
            className="rounded-t bg-gray-200 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 py-2 px-4 block whitespace-no-wrap"
            onClick={handleLogout}
          >
            Log Out
          </a>
        </li>
        <li>
          <a
            className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-700 py-2 px-4 block whitespace-no-wrap"
            onClick={() => setPage("setup2fa")}
          >
            Setup 2FA
          </a>
        </li>
      </ul>
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
    return (
      <LoginPage
        onSubmit={handleLogin}
        setPage={setPage}
        setIsLoggedIn={setIsLoggedIn}
        setLoggedInUserEmail={setLoggedInUserEmail} // Pass setLoggedInUserEmail here
      />
    );
  }

  if (page === "register") {
    return <RegisterPage onSubmit={handleRegister} />;
  }

  if (page === "signWallet") {
    return (
      <SignWalletPage
        userEmail={loggedInUserEmail}
        onGoBack={() => setPage("dashboard")}
      />
    );
  }

  if (page === "dashboard") {
    return (
      <div className="h-screen bg-black text-white flex flex-col justify-center items-center relative">
        {isLoggedIn && renderSettings()}
        <h1 className="text-center mt-10">Welcome to Your Dashboard</h1>
      </div>
    );
  }

  if (page === "setup2fa") {
    return isLoggedIn ? (
      <Setup2FA
        userEmail={loggedInUserEmail}
        onGoBack={() => setPage("dashboard")}
      />
    ) : (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        Access Denied. Please log in.
      </div>
    );
  }

  return null;
}

export default App;
