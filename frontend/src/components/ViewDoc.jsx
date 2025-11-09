import React, { useState } from "react";
import { ethers } from "ethers";
import { Container, TextField, Button, Card, CardContent, Typography, CircularProgress, Alert } from "@mui/material";
import cabi from "../../../j/artifacts/contracts/judiciary.sol/CourtRecords.json"; // Ensure correct ABI path

const CONTRACT_ADDRESS ="0x5B2DC3201E349Aeda12efe8586aA118BBD4f6981"; // Update with your contract address

const ViewDoc = () => {
  const [caseId, setCaseId] = useState("");
  const [docDetails, setDocDetails] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to fetch document details from blockchain
  const fetchDocument = async (caseId) => {
    try {
      if (!window.ethereum) {
        setMessage("⚠️ MetaMask is required!");
        return null;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, cabi.abi, signer);

      // Fetch stored document details
      const doc = await contract.getDocument(caseId);

      if (doc.hash === "") {
        setMessage("⚠️ No document found for this Case ID.");
        return null;
      }

      return {
        hash: doc.hash,
        uploader: doc.uploader,
        timestamp: new Date(Number(doc.timestamp) * 1000).toLocaleString(), // Convert UNIX timestamp
      };
    } catch (error) {
      console.error("❌ Error fetching document:", error);
      setMessage("❌ Failed to retrieve document.");
      return null;
    }
  };

  // Handle document retrieval
  const handleFetch = async () => {
    if (!caseId.trim()) {
      setMessage("⚠️ Please enter a valid Case ID.");
      return;
    }

    setLoading(true);
    setMessage("");
    setDocDetails(null);

    const doc = await fetchDocument(caseId);
    if (doc) {
      setDocDetails(doc);
      setMessage("✅ Document retrieved successfully.");
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "40px" }}>
      <Typography variant="h4" gutterBottom>
        Retrieve Court Document
      </Typography>

      <TextField
        label="Enter Case ID"
        variant="outlined"
        fullWidth
        value={caseId}
        onChange={(e) => setCaseId(e.target.value)}
        style={{ marginBottom: "16px" }}
      />

      <Button variant="contained" color="primary" fullWidth onClick={handleFetch} disabled={loading}>
        {loading ? <CircularProgress size={24} color="inherit" /> : "Fetch"}
      </Button>

      {message && (
        <Alert severity={message.includes("✅") ? "success" : "warning"} style={{ marginTop: "16px" }}>
          {message}
        </Alert>
      )}

      {docDetails && (
        <Card style={{ marginTop: "20px", backgroundColor: "#f5f5f5" }}>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              Document Details
            </Typography>
            <Typography variant="body1"><strong>Hash:</strong> {docDetails.hash}</Typography>
            <Typography variant="body1"><strong>Uploaded By:</strong> {docDetails.uploader}</Typography>
            <Typography variant="body1"><strong>Timestamp:</strong> {docDetails.timestamp}</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ViewDoc;