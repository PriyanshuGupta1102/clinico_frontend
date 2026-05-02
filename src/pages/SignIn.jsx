import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import InteractiveLogo from '../components/InteractiveLogo';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SignIn = () => {
  const { login } = useAuth();
  const [role, setRole] = useState('Patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [bgImage, setBgImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const hospitalImages = useMemo(() => [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=2071&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=2074&auto=format&fit=crop"
  ], []);

  useEffect(() => {
    setBgImage(hospitalImages[Math.floor(Math.random() * hospitalImages.length)]);
  }, [hospitalImages]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAction = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (role === 'Patient') {
        const res = await axios.post(`http://localhost:5000/api/login`, {
          email,
          password,
          role: 'patient'
        });

        if (res.data.success) {
          login({ 
            ...res.data.user, 
            role: 'Patient',
            token: res.data.token
          });
          localStorage.setItem('clinicoUser', JSON.stringify({ ...res.data.user, role: 'Patient' }));
          toast.success("Login Successful");
          navigate('/patient-dashboard');
        }
      } else if (role === 'Doctor') {
        const res = await axios.post(`http://localhost:5000/api/login`, {
          email,
          password,
          role: 'doctor'
        });

        if (res.data.success) {
          login({ 
            ...res.data.user, 
            role: 'Doctor',
            token: res.data.token
          });
          localStorage.setItem('clinicoUser', JSON.stringify({ ...res.data.user, role: 'Doctor' }));
          toast.success("Doctor Access Authorized");
          navigate('/doctor-dashboard');
        }
      } else if (role === 'Admin') {
        const ADMIN_EMAIL = 'Admin@gmail.com';
        const ADMIN_PASSWORD = '123456';

        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          login({ 
            name: 'System Admin',
            email: ADMIN_EMAIL,
            role: 'Admin'
          });
          localStorage.setItem('clinicoUser', JSON.stringify({ name: 'System Admin', email: ADMIN_EMAIL, role: 'Admin' }));
          toast.success("Admin Access Authorized");
          navigate('/admin-panel');
        } else {
          toast.error("Invalid Admin Credentials");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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
                  onClick={() => {setRole(r); setErrors({})}} 
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
              <input 
                type="email" 
                placeholder="Registered Email Address" 
                value={email} 
                onChange={(e) => {setEmail(e.target.value); setErrors({...errors, email: ''})}} 
                className={`w-full pl-14 pr-6 py-5 bg-slate-50 border-2 ${errors.email ? 'border-red-300' : 'border-transparent'} rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-700 shadow-inner`} 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">{errors.email}</p>}
            </div>

            <div className="relative group">
              <Lock className="absolute left-5 top-5 text-slate-400 group-focus-within:text-blue-500" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder={role === 'Admin' ? "Admin Password (123456)" : "Password"} 
                value={password} 
                onChange={(e) => {setPassword(e.target.value); setErrors({...errors, password: ''})}} 
                className={`w-full pl-14 pr-12 py-5 bg-slate-50 border-2 ${errors.password ? 'border-red-300' : 'border-transparent'} rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-bold text-slate-700 shadow-inner`} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-5 text-slate-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-2">{errors.password}</p>}
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 group disabled:opacity-50"
            >
              {loading ? 'Logging in...' : `Login as ${role}`} <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
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