import React from 'react';
import { Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-10 pt-20 pb-32">
      <div className="text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-bold text-sm tracking-wide">
          <Zap size={16} /> THE FUTURE OF HEALTHCARE
        </div>
        <h1 className="text-7xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
          Health Care <br /> <span className="text-blue-600 italic">Simplified.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          Book appointments with top doctors, get AI-driven health insights, and manage your medical records—all in one premium platform.
        </p>
        <div className="flex justify-center gap-5 pt-5">
          <button className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-300 hover:-translate-y-1 transition">
            Find Your Doctor
          </button>
          <button className="bg-slate-100 text-slate-900 px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-slate-200 transition">
            Explore Services
          </button>
        </div>
      </div>
    </div>
  );
};
export default Home;