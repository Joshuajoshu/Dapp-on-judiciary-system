import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { 
  Container, Typography, Button, TextField, Card, CardContent, Alert, 
  CircularProgress, Stack 
} from "@mui/material";
import cabi from "../../../j/artifacts/contracts/judiciary.sol/CourtRecords.json"; // Ensure ABI path is correct

const CONTRACT_ADDRESS = "0x5B2DC3201E349Aeda12efe8586aA118BBD4f6981"; // Update with deployed contract

const AuthorizeUsers = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [newUser, setNewUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Connect Wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      setMessage("⚠️ Install MetaMask to continue!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Check if connected wallet is the admin
  const checkAdmin = async () => {
    if (!walletAddress) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, cabi.abi, signer);

      const courtAdmin = await contract.courtAdmin();
      console.log(courtAdmin);
      setIsAdmin(walletAddress.toLowerCase() === courtAdmin.toLowerCase());
    } catch (error) {
      console.error("Error checking admin:", error);
      setIsAdmin(false);
    }
  };

  // Add authorized user
  const addAuthorizedUser = async () => {
    if (!isAdmin) {
      setMessage("❌ Only the admin can authorize users!");
      return;
    }
    if (!newUser) {
      setMessage("⚠️ Enter a valid address!");
      return;
    }

    try {
      setLoading(true);
      setMessage("⏳ Authorizing user...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, cabi.abi, signer);

      const tx = await contract.addAuthorizedUser(newUser);
      await tx.wait();

      setMessage(`✅ User ${newUser} authorized successfully!`);
      setNewUser("");
    } catch (error) {
      console.error("❌ Error authorizing user:", error);
      setMessage("❌ Failed to authorize user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAdmin();
  }, [walletAddress]);

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Authorize Users
      </Typography>

      {/* Wallet Connection */}
      {!walletAddress ? (
        <Button variant="contained" color="primary" onClick={connectWallet}>
          🔗 Connect Wallet
        </Button>
      ) : (
        <Typography variant="body1" sx={{ mb: 2 }}>
          ✅ Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </Typography>
      )}

      {/* Admin Check */}
      {walletAddress && (
        <Alert severity={isAdmin ? "success" : "warning"} sx={{ my: 2 }}>
          {isAdmin ? "✅ You are the Admin" : "⚠️ You are not the Admin"}
        </Alert>
      )}

      {/* Authorization Form */}
      {isAdmin && (
        <Card variant="outlined" sx={{ p: 3, mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Enter User Wallet Address
            </Typography>
            <TextField
              label="Wallet Address"
              variant="outlined"
              fullWidth
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={addAuthorizedUser} 
                disabled={loading || !newUser}
              >
                {loading ? <CircularProgress size={24} /> : "Authorize User"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Status Message */}
      {message && (
        <Alert severity={message.startsWith("✅") ? "success" : "error"} sx={{ mt: 3 }}>
          {message}
        </Alert>
      )}
    </Container>
  );
};

export default AuthorizeUsers;
