import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import cabi from "../../../j/artifacts/contracts/judiciary.sol/CourtRecords.json";
import { Container, TextField, Button, Card, CardContent, Typography, CircularProgress, Snackbar, Alert } from "@mui/material";

const CONTRACT_ADDRESS = "0x5B2DC3201E349Aeda12efe8586aA118BBD4f6981";

const UploadDoc = () => {
  const [caseId, setCaseId] = useState("");
  const [docHash, setDocHash] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Check if MetaMask is available
  const checkMetamask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      setMessage("⚠️ MetaMask not detected!");
      setOpenSnackbar(true);
    }
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!window.ethereum) {
      setMessage("⚠️ Install MetaMask to continue!");
      setOpenSnackbar(true);
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Upload document hash to the blockchain
  const handleUpload = async () => {
    if (!walletAddress) {
      setMessage("⚠️ Please connect your wallet first!");
      setOpenSnackbar(true);
      return;
    }
    if (!caseId || !docHash) {
      setMessage("⚠️ Case ID and document hash are required!");
      setOpenSnackbar(true);
      return;
    }

    try {
      setIsLoading(true);
      setMessage("⏳ Processing transaction...");
      setOpenSnackbar(true);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, cabi.abi, signer);

      const isAuthorized = await contract.authorizedUsers(walletAddress);
      console.log("Connected Wallet Address:", walletAddress);
      console.log("User Authorized:", isAuthorized);

      if (!isAuthorized) {
        setMessage("❌ Access denied: Not authorized!");
        setIsLoading(false);
        setOpenSnackbar(true);
        return;
      }

      const tx = await contract.storeDocument(caseId, docHash);
      await tx.wait();

      setMessage("✅ Document stored successfully!");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("❌ Error uploading document:", error);
      setMessage("❌ Failed to store document.");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkMetamask();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card sx={{ p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center">
            Upload Court Document
          </Typography>

          {/* Wallet Connection */}
          {!walletAddress ? (
            <Button variant="contained" fullWidth color="primary" onClick={connectWallet} sx={{ mb: 2 }}>
              🔗 Connect Wallet
            </Button>
          ) : (
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              ✅ Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </Typography>
          )}

          {/* Case ID Input */}
          <TextField
            label="Case ID"
            fullWidth
            variant="outlined"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Document Hash Input */}
          <TextField
            label="Document Hash"
            fullWidth
            variant="outlined"
            value={docHash}
            onChange={(e) => setDocHash(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Upload Button */}
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleUpload}
            disabled={isLoading}
            sx={{ mb: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Upload"}
          </Button>

          {/* Status Message */}
          {message && (
            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
              <Alert severity="info" sx={{ width: "100%" }}>
                {message}
              </Alert>
            </Snackbar>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default UploadDoc;
