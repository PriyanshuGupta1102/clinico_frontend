import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import InteractiveLogo from '../components/InteractiveLogo';
import toast, { Toaster } from 'react-hot-toast';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Abhi hum sirf redirection aur UI handle kar rahe hain
    toast.success('Account Created Successfully! Redirecting to Login...');
    setTimeout(() => {
      navigate('/signin');
    }, 2000);
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
      {/* Dynamic Background */}
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
            <input required onChange={(e)=>setFormData({...formData, name: e.target.value})} type="text" placeholder="Full Name" className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
            <input required onChange={(e)=>setFormData({...formData, email: e.target.value})} type="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            <input required onChange={(e)=>setFormData({...formData, password: e.target.value})} type="password" placeholder="Create Password" className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-900 transition shadow-xl active:scale-95">
            Register Account
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