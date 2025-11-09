import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { 
  Container, Typography, Button, Card, CardContent, Alert, CircularProgress, 
  Stack, IconButton, Tooltip 
} from "@mui/material";
import { ContentCopy, Download } from "@mui/icons-material";
import cabi from "../../../j/artifacts/contracts/judiciary.sol/CourtRecords.json";

const CONTRACT_ADDRESS = "0x5B2DC3201E349fAeda12efe8586aA118BBD4f6981";

const AdminDocuments = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState(""); // State to track copied hash

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

  // Check if user is Admin
  const checkAdmin = async () => {
    if (!walletAddress) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, cabi.abi, signer);

      const courtAdmin = await contract.courtAdmin();
      setIsAdmin(walletAddress.toLowerCase() === courtAdmin.toLowerCase());
    } catch (error) {
      console.error("Error checking admin:", error);
      setIsAdmin(false);
    }
  };

  // Fetch all documents (Admin only)
  const fetchDocuments = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      setMessage("⏳ Fetching documents...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, cabi.abi, signer);

      const docs = await contract.getAllDocuments();

      const formattedDocs = docs.map((doc) => ({
        caseId: Number(doc.caseId),
        hash: doc.hash,
        uploader: doc.uploader,
        timestamp: new Date(Number(doc.timestamp) * 1000).toLocaleString(),
      }));

      setDocuments(formattedDocs);
      setMessage("✅ Documents retrieved successfully.");
    } catch (error) {
      console.error("Error fetching documents:", error);
      setMessage("❌ Failed to retrieve documents.");
    } finally {
      setLoading(false);
    }
  };

  // Copy hash to clipboard
  const handleCopy = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(""), 2000); // Reset after 2 seconds
  };

  // Simulate File Download using Document Hash
  const handleDownload = (hash) => {
    const fileContent = `Document Hash: ${hash}\nVerified by Blockchain`;
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${hash}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  useEffect(() => {
    checkAdmin();
  }, [walletAddress]);

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin: View & Download Documents
      </Typography>

      {!walletAddress ? (
        <Button variant="contained" color="primary" onClick={connectWallet}>
          🔗 Connect Wallet
        </Button>
      ) : (
        <Typography variant="body1" sx={{ mb: 2 }}>
          ✅ Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </Typography>
      )}

      {walletAddress && (
        <Alert severity={isAdmin ? "success" : "warning"} sx={{ my: 2 }}>
          {isAdmin ? "✅ You are an Admin" : "⚠️ You are not an Admin"}
        </Alert>
      )}

      {isAdmin && (
        <>
          <Button
            variant="contained"
            color="secondary"
            onClick={fetchDocuments}
            sx={{ mt: 2, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Fetch All Documents"}
          </Button>

          <Typography variant="body1">{message}</Typography>

          <Stack spacing={2} sx={{ mt: 3 }}>
            {documents.length > 0 ? (
              documents.map((doc, index) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Case ID: {doc.caseId}</Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                        <strong>Hash:</strong> {doc.hash}
                      </Typography>
                      <Tooltip title={copiedHash === doc.hash ? "Copied!" : "Copy Hash"}>
                        <IconButton color="primary" onClick={() => handleCopy(doc.hash)}>
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                    <Typography variant="body2">
                      <strong>Uploader:</strong> {doc.uploader}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Timestamp:</strong> {doc.timestamp}
                    </Typography>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Download />}
                      onClick={() => handleDownload(doc.hash)}
                      sx={{ mt: 1 }}
                    >
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body1" sx={{ mt: 2 }}>
                No documents available.
              </Typography>
            )}
          </Stack>
        </>
      )}
    </Container>
  );
};

export default AdminDocuments;
