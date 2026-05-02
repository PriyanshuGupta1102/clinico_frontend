import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import InteractiveLogo from '../components/InteractiveLogo';
import axios from 'axios';

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    specialization: '',
    experience: '',
    fees: '',
    gender: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (!formData.fees) newErrors.fees = 'Consultation fee is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/doctor-register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        specialization: formData.specialization,
        experience: parseInt(formData.experience),
        fees: parseInt(formData.fees),
        gender: formData.gender
      });

      if (res.data.success) {
        toast.success('Doctor Profile Created Successfully!');
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-10 relative overflow-hidden">
      <Toaster position="top-center" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full blur-[100px] opacity-30 -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full blur-[100px] opacity-30 -ml-20 -mb-20"></div>

      <div className="max-w-3xl w-full bg-white/70 backdrop-blur-md p-12 rounded-[3rem] border border-white shadow-2xl relative z-10">
        <div className="flex justify-center mb-6"><InteractiveLogo size={40} /></div>
        <h1 className="text-4xl font-black text-slate-900 mb-2 text-center">Doctor <span className="text-blue-600">Onboarding</span></h1>
        <p className="text-slate-500 text-center mb-10 font-medium">Step into the future of digital medicine.</p>
        
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <input 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              type="text" 
              placeholder="First Name *" 
              className={`w-full p-4 rounded-2xl border ${errors.firstName ? 'border-red-500' : 'border-slate-100'} bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500`} 
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>
          <div>
            <input 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              type="text" 
              placeholder="Last Name *" 
              className={`w-full p-4 rounded-2xl border ${errors.lastName ? 'border-red-500' : 'border-slate-100'} bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500`} 
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
          
          <div className="md:col-span-2">
            <input 
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email" 
              placeholder="Professional Email *" 
              className={`w-full p-4 rounded-2xl border ${errors.email ? 'border-red-500' : 'border-slate-100'} bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500`} 
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="md:col-span-2">
            <input 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel" 
              placeholder="Phone Number *" 
              className={`w-full p-4 rounded-2xl border ${errors.phone ? 'border-red-500' : 'border-slate-100'} bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500`} 
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          
          <div>
            <input 
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password" 
              placeholder="Password *" 
              className={`w-full p-4 rounded-2xl border ${errors.password ? 'border-red-500' : 'border-slate-100'} bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500`} 
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <input 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password" 
              placeholder="Confirm Password *" 
              className={`w-full p-4 rounded-2xl border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-100'} bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500`} 
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          
          <div>
            <input 
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              type="text" 
              placeholder="Specialization (e.g., Cardiologist) *" 
              className={`w-full p-4 rounded-2xl border ${errors.specialization ? 'border-red-500' : 'border-slate-100'} bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500`} 
            />
            {errors.specialization && <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>}
          </div>
          <div>
            <input 
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              type="number" 
              placeholder="Years of Experience *" 
              className={`w-full p-4 rounded-2xl border ${errors.experience ? 'border-red-500' : 'border-slate-100'} bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500`} 
            />
            {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
          </div>
          
          <div>
            <input 
              name="fees"
              value={formData.fees}
              onChange={handleChange}
              type="number" 
              placeholder="Consultation Fee (INR) *" 
              className={`w-full p-4 rounded-2xl border ${errors.fees ? 'border-red-500' : 'border-slate-100'} bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500`} 
            />
            {errors.fees && <p className="text-red-500 text-xs mt-1">{errors.fees}</p>}
          </div>

          <div>
            <select 
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full p-4 rounded-2xl border ${errors.gender ? 'border-red-500' : 'border-slate-100'} bg-white font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select Gender *</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="md:col-span-2 mt-4 bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-900 transition shadow-2xl active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Creating Profile...' : 'Complete Registration'}
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