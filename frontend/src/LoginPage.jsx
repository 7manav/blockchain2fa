// LoginPage.jsx
import React, { useState } from "react";
import { ethers } from "ethers"; // Import ethers for wallet interaction

function LoginPage({ onSubmit, setPage, setIsLoggedIn, setLoggedInUserEmail }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Message state for login feedback
  const [is2FA, setIs2FA] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  async function handleLogin({ email, password }) {
    console.log("Sending login request with:", { email, password });
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (data.success) {
        setIsLoggedIn(true); // This will now update the parent state
        setMessage(""); // Clear message on successful login
        setLoggedInUserEmail(data.email); // Use setLoggedInUserEmail here
        setUserEmail(data.email); // Set userEmail for later use

        // Don't generate nonce here
        if (data.is2faEnabled) {
          setIs2FA(true);
        } else {
          setMessage("Welcome to the dashboard!");
          setPage("dashboard"); // Move to the dashboard if no 2FA
        }
      } else {
        setMessage(data.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Server error during login.");
    }
  }
  const handleSignWallet = async () => {
    if (!window.ethereum) {
      setMessage("MetaMask is not installed!");
      return;
    }

    // Fetch user data to get the current nonce
    const response = await fetch(`http://localhost:5000/api/user/${userEmail}`);
    const data = await response.json();

    if (data.success) {
      const { walletAddress, nonce } = data.user;

      // Declare newNonce variable
      let newNonce;

      // Check if nonce is null (indicating a previous invalid attempt)
      if (!nonce) {
        // Generate a new nonce on button click
        newNonce = Math.random().toString(36).substring(2, 10); // Generate a new random nonce

        // Update the user record with the new nonce
        await fetch("http://localhost:5000/api/updateUser ", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, nonce: newNonce }),
        });
      } else {
        newNonce = nonce; // Use existing nonce if available
      }

      // Create a message to sign
      const messageToSign = `Sign this message to verify your identity: ${newNonce}`;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      try {
        // Request the user to sign the message
        const signature = await signer.signMessage(messageToSign);

        // Send the signature and nonce to the server for verification
        const verificationResponse = await fetch(
          "http://localhost:5000/verify-signature",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userEmail,
              signature,
              nonce: newNonce,
            }),
          }
        );

        const verificationData = await verificationResponse.json();
        if (verificationData.success) {
          setMessage("Wallet signed successfully!");
          setPage("dashboard"); // Redirect to dashboard after successful signing
        } else {
          setMessage(verificationData.message);
        }
      } catch (error) {
        console.error("Signing failed:", error);
        setMessage("Signing failed. Please try again.");
      }
    } else {
      console.error("User  not found");
      setMessage("User  not found.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      {!is2FA ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin({ email, password });
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
      ) : (
        <div className="text-center space-y-4">
          <h1 className="text-lg">
            Please sign the transaction in your wallet.
          </h1>
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600"
            onClick={handleSignWallet}
          >
            Sign Wallet
          </button>
          <p className="mt-4">Email: {userEmail}</p>
        </div>
      )}
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}

export default LoginPage;
