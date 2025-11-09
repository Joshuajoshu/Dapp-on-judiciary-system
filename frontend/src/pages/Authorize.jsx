import React from "react";
import { Container, Typography, Paper } from "@mui/material";
import AuthorizeUsers from "../components/AuthorizeUsers";

const Authorize = () => {
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
          🔏 ADMINISTRATOR ADDING NODES IN THE BLOCKCHAIN        </Typography>
        <AuthorizeUsers />
      </Paper>
    </Container>
  );
};

export default Authorize;
