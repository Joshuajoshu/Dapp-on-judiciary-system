import { ethers } from "ethers";
import abi from "../../j/artifacts/contracts/judiciary.sol/CourtRecords.json"; // Ensure ABI is correctly placed

const CONTRACT_ADDRESS = "0x5B2DC3201E349Aeda12efe8586aA118BBD4f6981";

export const getEthereumContract = async () => {
  if (!window.ethereum) {
    console.error("MetaMask is not installed!");
    return null;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
};

export const connectWallet = async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask!");
    return null;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    return accounts[0];
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return null;
  }
};

export const checkWalletConnection = async () => {
  if (!window.ethereum) return null;
  
  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error("Error checking wallet connection:", error);
    return null;
  }
};
