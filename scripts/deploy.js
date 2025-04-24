const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Get the contract factory
    const Auth = await hre.ethers.getContractFactory("Auth");
    console.log("Contract factory retrieved:", Auth);

    // Deploy the contract
    const auth = await Auth.deploy();
    console.log("Deploying contract...");
    
    // Check the type of the auth object
    console.log("auth object:", auth);

    // Wait for the deployment to finish
    try {
        await auth.deployed();
        console.log("Auth contract deployed to:", auth.address);
    } catch (error) {
        console.error("Error in deployed():", error);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
