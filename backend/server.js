const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { ethers } = require("ethers");
const app = express();
app.use(express.json());
app.use(cors());

const recipientAddress = "0x8A1a1911FDD61F203Faa76cC7c8E0F9b8F1Ec69B";

app.post("/verify-2fa", async (req, res) => {
    const { txHash } = req.body;

    try {
        // Connect to the blockchain
        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");

        // Get transaction details
        const tx = await provider.getTransaction(txHash);

        // Verify transaction
        if (tx && tx.to === recipientAddress && tx.value.gte(ethers.utils.parseEther("0.001"))) {
            return res.json({ success: true, message: "Transaction verified!" });
        }

        res.json({ success: false, message: "Invalid transaction." });
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ success: false, message: "Server error during verification." });
    }
});

// MongoDB connection
mongoose.connect("mongodb+srv://manav7phull:2QpJUssHJ22hlGwX@blockchain.sybdb.mongodb.net/?retryWrites=true&w=majority&appName=blockchain")
    .then(() => console.log("Connected to MongoDB successfully!"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));


// User schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    txHash: { type: String, default: null }, // Transaction hash
    nonce: { type: String, default: null }, // Nonce value
    is2faEnabled: { type: Boolean, default: false },
    walletAddress: { type: String, default: null }, // User's wallet address
});
const User = mongoose.model("User", userSchema);

// Register endpoint
app.post("/register", async (req, res) => {
    const { email, password, txHash, walletAddress } = req.body; // Exclude nonce from registration
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser  = new User({
            email,
            password: hashedPassword,
            txHash: txHash || null, // Initialize txHash
            nonce: null, // Initialize nonce to null
            is2faEnabled: false, // Default false
            walletAddress: walletAddress || null // Initialize walletAddress
        });
        await newUser .save();
        res.json({ success: true, message: "User  registered successfully!" });
    } catch (err) {
        if (err.code === 11000) { // Duplicate key error
            return res.json({ success: false, message: "Email already exists." });
        }
        res.json({ success: false, message: "Error registering user." });
    }
});

// Login endpoint
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Generate a new nonce for 2FA
            if (user.is2faEnabled) {
                const nonce = Math.floor(Math.random() * 1000000).toString(); // Generate a random nonce
                user.nonce = nonce; // Store nonce in user record
                await user.save(); // Save the updated user record
            }

            res.json({
                success: true,
                message: "Login successful!",
                email: user.email,
                is2faEnabled: user.is2faEnabled,
                nonce: user.nonce // Include nonce in the response
            });
        } else {
            res.json({ success: false, message: "Invalid credentials." });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
});



app.post('/api/updateUser', async (req, res) => {
    const { email, txHash, nonce, walletAddress, is2faEnabled } = req.body;

    console.log("Update Request Payload:", req.body);

    try {
        const result = await User.updateOne(
            { email },
            { $set: { txHash, nonce, walletAddress, is2faEnabled } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        res.status(200).send({ success: true });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send({ success: false, message: 'Update failed' });
    }
});

// Endpoint to fetch user data by email
app.get("/api/user/:email", async (req, res) => {
    const { email } = req.params;
    
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
      
      res.json({ success: true, user: user });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ success: false, message: "Error fetching user data" });
    }
  });
  
//verify signature
app.post("/verify-signature", async (req, res) => {
    const { email, signature, nonce } = req.body;

    try {
        // Fetch user from the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User  not found." });
        }

        // Verify the signature
        const message = `Sign this message to verify your identity: ${nonce}`;
        const signerAddress = ethers.utils.verifyMessage(message, signature);

        // Check if the signer address matches the user's wallet address
        if (signerAddress === user.walletAddress) {
            // Successful verification
            user.nonce = null; // Reset nonce after successful verification
            await user.save(); // Save the updated user record
            return res.json({ success: true, message: "Signature verified!" });
        } else {
            // Invalid signature, reset nonce
            user.nonce = null; // Reset nonce after failed verification
            await user.save(); // Save the updated user record
            return res.json({ success: false, message: "Invalid signature." });
        }
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({ success: false, message: "Server error during verification." });
    }
});

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
