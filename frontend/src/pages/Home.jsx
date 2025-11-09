import React from "react";
import { Container, Typography, Paper, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", py: 5 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", color: "#2c3e50" }}>
          Welcome to Judiciary Blockchain DApp
        </Typography>
        <Typography variant="h6" sx={{ color: "#555", mb: 3 }}>
          Securely store and verify court documents on the blockchain.
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mx: 1, px: 3, py: 1.2, fontSize: "1rem" }}
            onClick={() => navigate("/authorize")}
          >
            🔑 Authorize Users
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mx: 1, px: 3, py: 1.2, fontSize: "1rem" }}
            onClick={() => navigate("/verify")}
          >
            ✅ Verify Documents
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Home;
