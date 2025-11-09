import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/NavBar";
import Authorize from "./pages/Authorize";
import AdminDocuments from "./components/AdminDocuments";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/authorize" element={<Authorize/>}/>
        <Route path="/documents" element={<AdminDocuments/>}/>
        
      </Routes>
    </Router>
  );

};

export default App;
