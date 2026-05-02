import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const PaymentGateway = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const amount = location.state?.amount || 1200;
  const doctorName = location.state?.doctorName || 'Doctor';
  const doctorSpec = location.state?.specialization || 'Specialist';

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cardHolderName.trim()) {
      newErrors.cardHolderName = 'Card holder name is required';
    } else if (formData.cardHolderName.trim().length < 2) {
      newErrors.cardHolderName = 'Please enter valid name';
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Please enter valid format (MM/YY)';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      if (expDate < new Date()) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Please enter valid CVV (3-4 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      const cleaned = value.replace(/\D/g, '').slice(0, 16);
      const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
      setFormData({ ...formData, cardNumber: formatted });
    } else if (name === 'expiryDate') {
      let cleaned = value.replace(/\D/g, '').slice(0, 4);
      if (cleaned.length > 2) {
        cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
      }
      setFormData({ ...formData, expiryDate: cleaned });
    } else if (name === 'cvv') {
      setFormData({ ...formData, cvv: value.replace(/\D/g, '').slice(0, 4) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    setErrors({ ...errors, [name]: '' });
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      toast.error('Please fill all fields correctly');
      return;
    }

    setProcessing(true);
    toast.loading("Processing secure payment...");

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.dismiss();
      toast.success("Payment Successful! Appointment Booked.");
      
      setTimeout(() => {
        navigate('/patient-dashboard', { 
          state: { paymentSuccess: true, doctorName, amount } 
        });
      }, 1500);
    } catch (error) {
      toast.dismiss();
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Toaster position="top-center" />
      <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-xl">
              <ArrowLeft/>
            </button>
            <h2 className="text-xl font-black italic">Clinico Pay</h2>
            <ShieldCheck/>
        </div>
        <div className="p-10 space-y-8">
            <div className="text-center">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Amount to Pay</p>
                <h1 className="text-5xl font-black text-slate-800 mt-2">₹{amount.toLocaleString()}.00</h1>
                <p className="text-blue-600 font-bold mt-2">Consultation with Dr. {doctorName}</p>
                <p className="text-slate-400 text-sm">{doctorSpec}</p>
            </div>
            
            <div className="space-y-4 font-bold">
                <div>
                  <div className="relative">
                      <CreditCard className="absolute left-4 top-4 text-slate-400" />
                      <input 
                        type="text" 
                        name="cardHolderName"
                        value={formData.cardHolderName}
                        onChange={handleChange}
                        placeholder="Card Holder Name" 
                        className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border-2 ${errors.cardHolderName ? 'border-red-500' : 'border-transparent'} focus:border-blue-500`} 
                      />
                  </div>
                  {errors.cardHolderName && <p className="text-red-500 text-xs mt-1 ml-2">{errors.cardHolderName}</p>}
                </div>
                
                <div>
                  <div className="relative">
                      <CreditCard className="absolute left-4 top-4 text-slate-400" />
                      <input 
                        type="text" 
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="Card Number (XXXX XXXX XXXX XXXX)" 
                        className={`w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none border-2 ${errors.cardNumber ? 'border-red-500' : 'border-transparent'} focus:border-blue-500`} 
                      />
                  </div>
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1 ml-2">{errors.cardNumber}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4 font-bold">
                  <div>
                    <input 
                      type="text" 
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY" 
                      maxLength={5}
                      className={`w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 ${errors.expiryDate ? 'border-red-500' : 'border-transparent'} focus:border-blue-500`} 
                    />
                    {errors.expiryDate && <p className="text-red-500 text-xs mt-1 ml-2">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <input 
                      type="password" 
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="CVV" 
                      maxLength={4}
                      className={`w-full p-4 bg-slate-50 rounded-2xl outline-none border-2 ${errors.cvv ? 'border-red-500' : 'border-transparent'} focus:border-blue-500`} 
                    />
                    {errors.cvv && <p className="text-red-500 text-xs mt-1 ml-2">{errors.cvv}</p>}
                  </div>
                </div>
            </div>
            
            <button 
              onClick={handlePayment} 
              disabled={processing}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {processing ? "Processing..." : "Pay Securely Now"} <Lock size={20}/>
            </button>
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bank-grade 256-bit encryption</p>
        </div>
      </div>
    </div>
  );
};
export default PaymentGateway;