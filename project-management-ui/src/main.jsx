import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Pages
import AppLanding from './pages/AppLanding.jsx';
import LearnMore from './pages/LearnMore.jsx';
import Pricing from './pages/Pricing.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx'; // or your actual main app

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLanding />} />
        <Route path="/learn" element={<LearnMore />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ FIXED here */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
