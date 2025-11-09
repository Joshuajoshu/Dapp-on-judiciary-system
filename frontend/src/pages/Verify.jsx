import React from "react";
import { Container, Typography, Paper } from "@mui/material";
import VerifyDocument from "../components/VerifyDoc.jsx";

const Verify = () => {
  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          textAlign: "center",
          backgroundColor: "#f5f5f5",
          borderRadius: "12px",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          ✅ Verify Court Document
        </Typography>
        <VerifyDocument />
      </Paper>
    </Container>
  );
};

export default Verify;
