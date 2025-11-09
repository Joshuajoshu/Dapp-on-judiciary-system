import React from "react";
import { Container, Typography, Paper } from "@mui/material";
import ViewDoc from "../components/ViewDoc.jsx";

const Dashboard = () => {
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
          📂 Court Records Dashboard
        </Typography>
        <ViewDoc />
      </Paper>
    </Container>
  );
};

export default Dashboard;
