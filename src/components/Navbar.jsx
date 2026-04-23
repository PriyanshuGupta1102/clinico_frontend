import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Bot } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-10 py-6 bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-2xl shadow-lg shadow-blue-200">
          <Activity className="text-white" size={24} />
        </div>
        <span className="text-2xl font-black tracking-tight">Clinico<span className="text-blue-600">.</span></span>
      </div>
      <div className="hidden md:flex items-center gap-10 font-bold text-slate-500">
        <Link to="/" className="hover:text-blue-600 transition">Home</Link>
        <Link to="/doctors" className="hover:text-blue-600 transition">Doctors</Link>
        <Link to="/ai-consult" className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full">
          <Bot size={18}/> AI Consult
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/login" className="font-bold text-slate-700">Login</Link>
        <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200">
          Get Started
        </button>
      </div>
    </nav>
  );
};
export default Navbar;