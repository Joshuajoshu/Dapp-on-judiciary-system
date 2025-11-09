require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/53f8bd17aa2347d5bc7f9d3022a7c96a`, // Infura Sepolia RPC
      accounts: [`0x${process.env.PRIVATE_KEY}`], // Use your private key
    }
  }
};