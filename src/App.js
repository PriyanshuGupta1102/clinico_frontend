import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import DoctorRegister from './pages/DoctorRegister';
import Home from './pages/Home'; // Post-login page
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminPanel from './pages/AdminPanel';
import AIConsult from './pages/AIConsult';
import VideoVisit from './pages/VideoVisit'; 
import PaymentGateway from './pages/PaymentGateway';
import DoctorVideoVisit from './pages/DoctorVideoVisit';

function App() {
  return (
    <Router>
      <Routes>
        {/* Website ab yahan se shuru hogi */}
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />
        
        {/* Protected Routes (Login ke baad) */}
        <Route path="/home" element={<Home />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/ai-consult" element={<AIConsult />} />
        <Route path="/video-visit" element={<VideoVisit />} />
        <Route path="/payment" element={<PaymentGateway />} />
        <Route path="/doctor-video-visit" element={<DoctorVideoVisit />} />
      </Routes>
    </Router>
  );
}
export default App;