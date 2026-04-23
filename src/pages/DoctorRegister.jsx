import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import InteractiveLogo from '../components/InteractiveLogo';

const DoctorRegister = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    toast.success('Doctor Profile Created! Verification Pending.');
    setTimeout(() => {
      navigate('/signin');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-10 relative overflow-hidden">
      <Toaster position="top-center" />
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-[100px] opacity-30 -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full blur-[100px] opacity-30 -ml-20 -mb-20"></div>

      <div className="max-w-3xl w-full bg-white/70 backdrop-blur-md p-12 rounded-[3rem] border border-white shadow-2xl relative z-10">
        <div className="flex justify-center mb-6"><InteractiveLogo size={40} /></div>
        <h1 className="text-4xl font-black text-slate-900 mb-2 text-center">Doctor <span className="text-blue-600">Onboarding</span></h1>
        <p className="text-slate-500 text-center mb-10 font-medium">Step into the future of digital medicine.</p>
        
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input required type="text" placeholder="First Name" className="p-4 rounded-2xl border border-slate-100 bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <input required type="text" placeholder="Last Name" className="p-4 rounded-2xl border border-slate-100 bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <input required type="email" placeholder="Professional Email" className="md:col-span-2 p-4 rounded-2xl border border-slate-100 bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <input required type="password" placeholder="Password" className="p-4 rounded-2xl border border-slate-100 bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500" />
          <input required type="number" placeholder="Consultation Fees (INR)" className="p-4 rounded-2xl border border-slate-100 bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500" />
          
          <select className="p-4 rounded-2xl border border-slate-100 bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <button type="submit" className="md:col-span-2 mt-4 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-900 transition shadow-2xl active:scale-95">
            Complete Registration
          </button>
        </form>
        
        <div className="mt-8 text-center">
            <Link to="/signin" className="text-slate-400 font-bold hover:text-blue-600 transition">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};
export default DoctorRegister;