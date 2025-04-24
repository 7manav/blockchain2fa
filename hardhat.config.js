require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
  solidity: "0.8.0",  // or your preferred version
  networks: {
    localhost: {
      url: "http://127.0.0.1:7545",  // Adjust the URL if needed
      accounts: [process.env.PRIVATE_KEY],  // Load private key from .env
	  chainId: 1337, // Default Ganache chain ID
    },
  },
};
