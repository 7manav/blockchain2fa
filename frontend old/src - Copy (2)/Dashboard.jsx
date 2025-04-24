// Dashboard.jsx
import React, { useState } from "react";
import { ethers } from "ethers";

function Dashboard({ account }) {
    const [twoFAKey, setTwoFAKey] = useState(""); // Key user enters for 2FA verification
    const [is2FAEnabled, setIs2FAEnabled] = useState(false); // Flag to check if 2FA is enabled
    const [storedTwoFAKey, setStoredTwoFAKey] = useState(""); // Stored 2FA key for comparison

    const handleSetup2FA = async () => {
        if (!window.ethereum) {
            alert("MetaMask is not installed!");
            return;
        }
    
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
            const userAddress = await signer.getAddress(); // Fetch the connected wallet address
    
            // Define the transaction (ensure `to` address is different from `from`)
            const tx = await signer.sendTransaction({
                to: "0x8A1a1911FDD61F203Faa76cC7c8E0F9b8F1Ec69B", // Replace with a test address
                value: ethers.utils.parseEther("0.01"), // Sending 0.01 ETH
            });
    
            await tx.wait(); // Wait for the transaction to be mined
    
            const generatedKey = ethers.utils.keccak256(tx.hash); // Generate 2FA key
            console.log("Generated 2FA Key:", generatedKey);
    
            setStoredTwoFAKey(generatedKey); // Store the key for verification
            alert("2FA setup completed using blockchain.");
        } catch (error) {
            console.error("Error during 2FA setup:", error);
        }
    };
    

    const handleVerify2FA = () => {
        // Verify if the entered 2FA key matches the stored one
        if (twoFAKey === storedTwoFAKey) {
            alert("2FA verified successfully!");
        } else {
            alert("Incorrect 2FA key. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome, {account}</h1>

            {is2FAEnabled ? (
                <>
                    <div>
                        <input
                            type="text"
                            placeholder="Enter 2FA Key"
                            value={twoFAKey}
                            onChange={(e) => setTwoFAKey(e.target.value)}
                            className="border rounded-lg p-3 w-full"
                        />
                    </div>
                    <button
                        onClick={handleVerify2FA} // This triggers 2FA verification
                        className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600"
                    >
                        Verify 2FA
                    </button>
                </>
            ) : (
                <button
                    onClick={handleSetup2FA} // This triggers 2FA setup
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600"
                >
                    Setup 2FA
                </button>
            )}
        </div>
    );
}

export default Dashboard;
