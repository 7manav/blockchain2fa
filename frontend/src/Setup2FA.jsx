import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

function Setup2FA({ userEmail, onGoBack }) {
  const [transactionHash, setTransactionHash] = useState("");
  const [message, setMessage] = useState("");
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  const recipientAddress = "0x8A1a1911FDD61F203Faa76cC7c8E0F9b8F1Ec69B"; // This is the recipient's address

  // Fetch user details when component loads
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from the backend
        const response = await fetch(
          `http://localhost:5000/api/user/${userEmail}`
        );
        const data = await response.json();

        // Check the response from the server
        if (data.success) {
          // Check if 2FA is enabled
          if (data.user.is2faEnabled) {
            setIs2faEnabled(true);
            setMessage(
              "2FA is already enabled. You can disable it if you want."
            );
          } else {
            setIs2faEnabled(false);
            setMessage("2FA is not enabled. Set it up below.");
          }
        } else {
          setMessage("Error fetching user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMessage("Error fetching user data.");
      }
    };

    if (userEmail) {
      fetchUserData();
    }
  }, [userEmail]);

  const triggerTransaction = async () => {
    try {
      if (!window.ethereum) {
        setMessage("MetaMask is not installed!");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request MetaMask accounts
      const signer = provider.getSigner();

      // Get the address of the signer (the wallet making the transaction)
      const signerAddress = await signer.getAddress();

      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: ethers.utils.parseEther("0.001"),
      });

      setTransactionHash(tx.hash);
      setMessage("Transaction sent! Please verify on the server.");
    } catch (error) {
      console.error("Error during transaction:", error);
      setMessage("Transaction failed. Please try again.");
    }
  };

  const verifyTransaction = async () => {
    try {
      if (!transactionHash) {
        setMessage("No transaction to verify!");
        return;
      }

      const response = await fetch("http://localhost:5000/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash: transactionHash }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("2FA setup verified successfully!");
        setIsSaveEnabled(true);
      } else {
        setMessage("Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("Error verifying transaction.");
    }
  };

  const saveUserData = async () => {
    try {
      // Fetch the signer address after wallet connection
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress(); // Get signer (wallet) address

      const response = await fetch("http://localhost:5000/api/updateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          txHash: transactionHash,
          walletAddress: signerAddress, // Save the wallet address of the signer
          is2faEnabled: true,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("User data updated successfully!");
        setIs2faEnabled(true); // After saving, 2FA should be enabled
      } else {
        setMessage(`Failed to update user data: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      setMessage("Error updating user data.");
    }
  };

  const disable2FA = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/updateUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          txHash: null, // Set to null when disabling
          nonce: null, // Set to null when disabling
          walletAddress: null, // Set to null when disabling
          is2faEnabled: false, // Set to false when disabling
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("2FA has been disabled.");
        setIs2faEnabled(false);
      } else {
        setMessage(`Failed to disable 2FA: ${data.message}`);
      }
    } catch (error) {
      console.error("Error disabling 2FA:", error);
      setMessage("Error disabling 2FA.");
    }
  };

  return (
    <div className="h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Setup 2FA</h1>
      <p className="mb-4">{message}</p>
      {is2faEnabled ? (
        <button
          onClick={disable2FA}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mb-4"
        >
          Disable 2FA
        </button>
      ) : (
        <>
          <button
            onClick={triggerTransaction}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-4"
          >
            Trigger Transaction
          </button>
          {transactionHash && (
            <p className="mb-4">
              Transaction Hash:{" "}
              <span className="text-green-400">{transactionHash}</span>
            </p>
          )}
          <button
            onClick={verifyTransaction}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 mb-4"
          >
            Verify Transaction
          </button>
          <button
            onClick={saveUserData}
            className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 mb-4"
            disabled={!isSaveEnabled}
          >
            Save
          </button>
        </>
      )}
      <button
        onClick={onGoBack}
        className="mt-4 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default Setup2FA;
