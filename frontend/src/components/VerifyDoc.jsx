import React, { useState } from "react";
import { ethers } from "ethers";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import cabi from "../../../j/artifacts/contracts/judiciary.sol/CourtRecords.json"; // Ensure correct ABI path

const CONTRACT_ADDRESS = "0x5B2DC3201E349Aeda12efe8586aA118BBD4f6981"; // Replace with your contract address

const VerifyDoc = () => {
  const [caseId, setCaseId] = useState("");
  const [docHash, setDocHash] = useState("");
  const [isValid, setIsValid] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Function to connect to contract
  const getEthereumContract = async () => {
    if (!window.ethereum) {
      setMessage("⚠️ MetaMask is required!");
      return null;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      return new ethers.Contract(CONTRACT_ADDRESS, cabi.abi, signer);
    } catch (error) {
      console.error("Error connecting to contract:", error);
      setMessage("❌ Failed to connect to blockchain.");
      return null;
    }
  };

  // Verify Document
  const handleVerify = async () => {
    if (!caseId.trim() || !docHash.trim()) {
      setMessage("⚠️ Case ID and Document Hash are required!");
      return;
    }

    setLoading(true);
    setMessage("⏳ Verifying document...");

    const contract = await getEthereumContract();
    if (!contract) {
      setLoading(false);
      return;
    }

    try {
      const result = await contract.verifyDocument(caseId, docHash);
      setIsValid(result);
      setMessage(result ? "✅ Document is valid." : "❌ Document is invalid!");
    } catch (error) {
      console.error("Verification error:", error);
      setIsValid(false);
      setMessage("❌ Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Verify Court Document
      </Typography>

      <Card variant="outlined" sx={{ p: 3, mt: 2 }}>
        <CardContent>
          {/* Case ID Input */}
          <TextField
            label="Case ID"
            variant="outlined"
            fullWidth
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Document Hash Input */}
          <TextField
            label="Document Hash"
            variant="outlined"
            fullWidth
            value={docHash}
            onChange={(e) => setDocHash(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* Verify Button */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleVerify}
              disabled={loading || !caseId || !docHash}
            >
              {loading ? <CircularProgress size={24} /> : "Verify"}
            </Button>
          </Stack>

          {/* Status Message */}
          {message && (
            <Alert severity={message.startsWith("✅") ? "success" : "error"} sx={{ mt: 3 }}>
              {message}
            </Alert>
          )}

          {/* Verification Result */}
          {isValid !== null && (
            <Alert severity={isValid ? "success" : "error"} sx={{ mt: 2, fontWeight: "bold" }}>
              {isValid ? "✅ Document is valid" : "❌ Document is invalid"}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default VerifyDoc;
