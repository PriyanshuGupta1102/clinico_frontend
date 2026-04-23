import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import InteractiveLogo from '../components/InteractiveLogo';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SignIn = () => {
  const { login } = useAuth();
  const [role, setRole] = useState('Patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [bgImage, setBgImage] = useState('');
  const navigate = useNavigate();

  const hospitalImages = useMemo(() => [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=2071&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=2074&auto=format&fit=crop"
  ], []);

  useEffect(() => {
    setBgImage(hospitalImages[Math.floor(Math.random() * hospitalImages.length)]);
  }, [hospitalImages]);

  const handleAction = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    if (role === 'Patient') {
      if (!otpSent) {
        const loadToast = toast.loading("Connecting to secure server...");
        try {
          const res = await axios.post('https://clinico-backend-7a06.onrender.com/api/send-otp', { email });
          toast.dismiss(loadToast);
          if (res.data.success) {
            setOtpSent(true);
            window.generatedOtp = res.data.secret.toString();
            toast.success("OTP has been sent to your email address");
          }
        } catch (err) {
          toast.dismiss(loadToast);
          toast.error("Server connection failed! Please check backend.");
        }
      } else {
        if (otp === window.generatedOtp) {
          login({ email, role: 'Patient', firstName: email.split('@')[0] });
          toast.success("Login Successful");
          navigate('/patient-dashboard');
        } else {
          toast.error("Invalid OTP! Access Denied.");
        }
      }
    } else {
      // Doctor & Admin Login Logic
      if (!password) return toast.error("Please enter your password");
      
      const extractedName = email.split('@')[0];
      const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);

      const userData = {
        email: email,
        role: role,
        firstName: formattedName,
        lastName: "Professional",
        speciality: role === 'Admin' ? "System Admin" : "Senior Medical Consultant",
        fees: "1200",
        gender: "Male"
      };

      login(userData);
      toast.success(role + " Access Authorized");
      navigate(role === 'Admin' ? '/admin-panel' : '/doctor-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 overflow-hidden bg-slate-100">
      <Toaster position="top-right" />
      
      <div className="absolute inset-0 z-0">
        <img src={bgImage} className="w-full h-full object-cover scale-110 opacity-60" alt="background" />
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[4px]"></div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl w-full bg-white rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 border border-white/20">
        
        <div className="md:w-5/12 bg-blue-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <InteractiveLogo size={60} />
            <h1 className="text-5xl font-black mt-8 tracking-tighter italic">Clinico<span className="text-red-400">.</span></h1>
            <p className="mt-4 text-blue-100 font-medium italic">Advanced Healthcare Management System</p>
          </div>
          <p className="text-[10px] font-black tracking-widest uppercase opacity-60 relative z-10">THE PULSE OF INNOVATION</p>
        </div>

        <div className="md:w-7/12 p-10 md:p-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{role} Login</h2>
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              {['Patient', 'Doctor', 'Admin'].map(r => (
                <button 
                  key={r} 
                  onClick={() => {setRole(r); setOtpSent(false)}} 
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${role === r ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAction} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-5 top-5 text-slate-400 group-focus-within:text-blue-500" size={20} />
              <input required type="email" placeholder="Registered Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-700 shadow-inner" />
            </div>

            <AnimatePresence mode="wait">
              {role !== 'Patient' ? (
                <motion.div key="pass" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="relative group">
                  <Lock className="absolute left-5 top-5 text-slate-400 group-focus-within:text-blue-500" size={20} />
                  <input required type="password" placeholder="Secure Portal Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-700 shadow-inner" />
                </motion.div>
              ) : otpSent && (
                <motion.div key="otp" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative group">
                  <ShieldCheck className="absolute left-5 top-5 text-emerald-500" size={20} />
                  <input required type="text" placeholder="Enter 4-Digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-emerald-50 border-2 border-emerald-200 rounded-2xl outline-none font-black text-emerald-700 tracking-[0.5em] text-center" />
                </motion.div>
              )}
            </AnimatePresence>
            
            <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 group">
              {role === 'Patient' ? (otpSent ? 'Verify & Access' : 'Request OTP') : 'Authorize Login'} <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 text-center">
            {role === 'Patient' && (
              <p className="text-slate-500 font-bold">New patient? <Link to="/signup" className="text-blue-600 underline">Sign Up</Link></p>
            )}
            {role === 'Doctor' && (
              <p className="text-slate-500 font-bold">New doctor? <Link to="/doctor-register" className="text-blue-600 underline">Register Profile</Link></p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
