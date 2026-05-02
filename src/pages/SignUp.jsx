import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import InteractiveLogo from '../components/InteractiveLogo';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email (e.g., abc@gmail.com)';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'patient'
      });

      if (res.data.success) {
        toast.success('Account created successfully!');
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const bgImages = [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1538108197394-72f001540662?auto=format&fit=crop&q=80"
  ];
  const randomBg = bgImages[Math.floor(Math.random() * bgImages.length)];

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 overflow-hidden">
      <Toaster position="top-center" />
      <div className="absolute inset-0 z-0">
        <img src={randomBg} className="w-full h-full object-cover opacity-20" alt="bg" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-white/90"></div>
      </div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-10 rounded-[3rem] shadow-2xl border border-white z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
             <InteractiveLogo size={30} />
          </div>
          <h2 className="text-3xl font-black text-slate-800">Create Account</h2>
          <p className="text-slate-500 font-medium mt-2">Join Clinico Medical Network</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Full Name" 
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                setErrors({...errors, name: ''});
              }}
              className={`w-full pl-12 pr-4 py-4 bg-white border ${errors.name ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
          </div>
          
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              type="email" 
              placeholder="Email Address (abc@gmail.com)" 
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                setErrors({...errors, email: ''});
              }}
              className={`w-full pl-12 pr-4 py-4 bg-white border ${errors.email ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Create Password (min 6 chars)" 
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                setErrors({...errors, password: ''});
              }}
              className={`w-full pl-12 pr-12 py-4 bg-white border ${errors.password ? 'border-red-500' : 'border-slate-100'} rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium`}
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-slate-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-900 transition shadow-xl active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 font-bold">
          Already a member? <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};
export default SignUp;