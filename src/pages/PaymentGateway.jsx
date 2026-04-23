import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const PaymentGateway = () => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    toast.loading("Securing transaction...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Payment Successful! Appointment Booked.");
      navigate('/patient-dashboard');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Toaster position="top-center" />
      <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl"><ArrowLeft/></button>
            <h2 className="text-xl font-black italic">Clinico Pay</h2>
            <ShieldCheck/>
        </div>
        <div className="p-10 space-y-8">
            <div className="text-center">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Amount to Pay</p>
                <h1 className="text-5xl font-black text-slate-800 mt-2">₹1,200.00</h1>
            </div>
            <div className="space-y-4 font-bold">
                <div className="relative">
                    <CreditCard className="absolute left-4 top-4 text-slate-400" />
                    <input type="text" placeholder="Card Number" className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4 font-bold">
                    <input type="text" placeholder="MM/YY" className="p-4 bg-slate-50 rounded-2xl outline-none" />
                    <input type="password" placeholder="CVV" className="p-4 bg-slate-50 rounded-2xl outline-none" />
                </div>
            </div>
            <button onClick={handlePayment} disabled={processing} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                {processing ? "Processing..." : "Pay Securely Now"} <Lock size={20}/>
            </button>
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bank-grade 256-bit encryption</p>
        </div>
      </div>
    </div>
  );
};
export default PaymentGateway;