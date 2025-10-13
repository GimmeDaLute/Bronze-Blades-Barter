import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CombatPage from "./pages/CombatPage.jsx";
import TradePage from "./pages/TradePage.jsx";
import ResourcesPage from "./pages/ResourcesPage.jsx";
import "./index.css";

function Home() {
  return (
    <div className="page">
      <h1>🏛️ Bronze, Blades & Barter</h1>
      <p className="muted">Pick a page from the nav bar</p>
    </div>
  );
}

function Shell() {
  return (
    <>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/combat">Combat</Link>
        <Link to="/trade">Trade</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/combat" element={<CombatPage />} />
        <Route path="/trade" element={<TradePage />} />
        <Route path="/resources" element={<ResourcesPage />} />
      </Routes>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  </React.StrictMode>
);
