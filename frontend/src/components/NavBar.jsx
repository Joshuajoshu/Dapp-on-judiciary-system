import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import ConnectWallet from "./ConnectWallet";

const NavBar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#2c3e50", paddingY: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Side - Navigation Links */}
        <Box>
          {[
            { label: "Home", path: "/" },
            { label: "Upload", path: "/upload" },
            { label: "Verify", path: "/verify" },
            { label: "Dashboard", path: "/dashboard" },
            { label: "Authorize", path: "/authorize" },
            { label: "Admin Docs", path: "/documents" },
          ].map((item, index) => (
            <Button
              key={index}
              component={Link}
              to={item.path}
              sx={{
                color: "white",
                fontSize: "1rem",
                textTransform: "none",
                marginX: 1,
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Right Side - Wallet Connection */}
        <ConnectWallet />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
