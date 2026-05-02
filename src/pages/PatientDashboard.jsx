import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Pill, FileText, Bot, User, Heart, 
  Activity, X, Edit3, ShieldCheck, Star, Clock, Lock, 
  Thermometer, Droplets, Scale, CheckCircle2, AlertCircle, Upload, Image
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const PatientDashboard = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [bookingDoc, setBookingDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [myAppointments, setMyAppointments] = useState([]);
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [uploadingReport, setUploadingReport] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: 72,
    glucose: 110,
    bmi: 22.4,
    temperature: 98.6
  });

  const [symptom, setSymptom] = useState("");
  const [aiResult, setAiResult] = useState(null);

  const getAIAdvice = () => {
    if(!symptom) return toast.error("Please describe your symptoms in detail");
    const s = symptom.toLowerCase();
    toast.loading("AI Engine analyzing your symptoms...");

    setTimeout(() => {
        toast.dismiss();
        let res = {
            condition: "General Health Consultation",
            medicine: "General Multi-vitamin",
            practices: ["Maintain 8 hours of sleep", "Drink 3-4 liters of water", "Monitor symptoms for 24 hours"],
            severity: "Low"
        };

        if(s.includes("fever") || s.includes("temperature")) {
            res = {
                condition: "Viral Fever / Infection",
                medicine: "Dolo 650mg or Paracetamol (if temp > 100°F)",
                practices: ["Cold water sponging on forehead", "Complete bed rest", "Liquid diet (Soup, Coconut water)"],
                severity: "Moderate"
            };
        } else if(s.includes("stomach") || s.includes("digestion") || s.includes("loose")) {
            res = {
                condition: "Gastrointestinal Distress",
                medicine: "Digene Syrup or Tab. Pantocid 40mg",
                practices: ["Avoid spicy and oily food", "Drink ORS to maintain electrolytes", "Eat small, light meals (Khichdi/Curd)"],
                severity: "Moderate"
            };
        } else if(s.includes("headache") || s.includes("migraine") || s.includes("stress")) {
            res = {
                condition: "Migraine or Tension Headache",
                medicine: "Naproxen 500mg or Saridon",
                practices: ["Rest in a dark, quiet room", "Apply cold compress to forehead", "Avoid screen time (Mobile/Laptop)"],
                severity: "Low"
            };
        } else if(s.includes("cough") || s.includes("throat") || s.includes("cold")) {
            res = {
                condition: "Upper Respiratory Infection",
                medicine: "Alex Cough Formula or Lozenges",
                practices: ["Saltwater gargle 3 times a day", "Steam inhalation before bed", "Drink lukewarm water only"],
                severity: "Low"
            };
        } else if(s.includes("skin") || s.includes("rash") || s.includes("itch")) {
            res = {
                condition: "Dermatological Allergy",
                medicine: "Tab. Cetirizine 10mg",
                practices: ["Use mild, fragrance-free soap", "Apply calamine lotion on affected area", "Avoid scratching the skin"],
                severity: "Moderate"
            };
        } else if(s.includes("muscle") || s.includes("back pain") || s.includes("injury")) {
            res = {
                condition: "Musculoskeletal Strain",
                medicine: "Ibuprofen 400mg or Volini Gel",
                practices: ["Ice pack application for first 24h", "Avoid heavy lifting", "Gentle stretching exercises"],
                severity: "Low"
            };
        }
        setAiResult(res);
        toast.success("Analysis Complete!");
    }, 2000);
  };

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
      fetchMedicalRecords();
    }
    fetchDoctors();
  }, [user]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success && res.data.doctors.length > 0) {
        setDoctors(res.data.doctors.map(doc => ({
          id: doc._id,
          name: doc.name,
          spec: doc.specialization || 'General Physician',
          fee: doc.consultationFee || 500,
          rating: '4.8',
          exp: `${doc.experience || 5} Yrs`,
          image: doc.profileImage || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200'
        })));
      } else {
        setFallbackDoctors();
      }
    } catch (err) {
      console.log("Using fallback doctors");
      setFallbackDoctors();
    }
  };

  const setFallbackDoctors = () => {
    setDoctors([
      { id: '1', name: 'Dr. Priyanshu', spec: 'Senior Surgeon', fee: 2000, rating: '5.0', exp: '15 Yrs', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200' },
      { id: '2', name: 'Dr. Sarah Smith', spec: 'Cardiologist', fee: 1200, rating: '4.9', exp: '10 Yrs', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200' },
      { id: '3', name: 'Dr. James Wilson', spec: 'Neurologist', fee: 1500, rating: '4.8', exp: '12 Yrs', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200' },
      { id: '4', name: 'Dr. Emily Davis', spec: 'Dermatologist', fee: 1000, rating: '4.7', exp: '8 Yrs', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200' },
      { id: '5', name: 'Dr. Robert Fox', spec: 'Pediatrician', fee: 900, rating: '4.9', exp: '15 Yrs', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200' },
      { id: '6', name: 'Dr. Michael Brown', spec: 'Orthopedic', fee: 1300, rating: '4.6', exp: '11 Yrs', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200' },
    ]);
  };

  const fetchAppointments = async () => {
    if (!user || !user.id) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/appointments/${user.id}/patient`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setMyAppointments(res.data.appointments || []);
      }
    } catch (err) {
      console.log("Using default appointments");
    }
  };

  const fetchMedicalRecords = async () => {
    if (!user || !user.id) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/medical-records/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setMedicalRecords(res.data.records || []);
      }
    } catch (err) {
      console.log("Using default records");
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.spec?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const defaultRecords = [
    { id: 1, patientName: user?.name || 'Patient', name: 'Full Blood Count', date: 'Oct 12, 2024', dr: 'Hospital Lab', issue: 'Anemia Check', res: 'Normal', meds: 'Iron Supplements' },
    { id: 2, patientName: user?.name || 'Patient', name: 'MRI Brain Scan', date: 'Sep 28, 2024', dr: 'James Wilson', issue: 'Chronic Migraine', res: 'Mild Sinusitis', meds: 'Naproxen 500mg' },
    { id: 3, patientName: user?.name || 'Patient', name: 'Cardiac Stress Test', date: 'Aug 15, 2024', dr: 'Sarah Smith', issue: 'Chest Tightness', res: 'Healthy Rhythm', meds: 'None' },
    { id: 4, patientName: user?.name || 'Patient', name: 'Gallbladder Review', date: 'Jul 05, 2024', dr: 'Priyanshu', issue: 'Post-Surgery Followup', res: 'Full Recovery', meds: 'Antacids' }
  ];

  const records = medicalRecords.length > 0 ? medicalRecords : defaultRecords;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG and PNG images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setUser({ ...user, profileImage: reader.result });
        toast.success('Profile picture updated!');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error('Failed to upload image');
      setUploadingImage(false);
    }
  };

  const handlePayment = async () => {
    if (!user || !user.id) {
      toast.error("Please login again");
      return;
    }
    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }
    if (!bookingDoc || !bookingDoc.id) {
      toast.error("No doctor selected");
      return;
    }
    
    const loadingToast = toast.loading("Processing Payment...");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/appointments', {
        patientId: user.id,
        patientName: user?.name || user?.firstName || 'Patient',
        doctorId: bookingDoc.id,
        doctorName: bookingDoc.name,
        doctorSpecialization: bookingDoc.spec,
        date: selectedDate,
        time: selectedTime,
        fee: bookingDoc.fee
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.dismiss(loadingToast);
      
      if (res.data.success) {
        toast.success("Payment Successful! Appointment Confirmed!");
        fetchAppointments();
      } else {
        toast.error("Payment failed: " + (res.data.message || "Please try again."));
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.dismiss(loadingToast);
      toast.error("Payment failed. Please try again.");
    }
    setShowPayModal(false);
    setBookingDoc(null);
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleReportUpload = async (e) => {
    if (!user || !user.id) {
      toast.error("Please login again");
      return;
    }
    
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG and PDF files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size should be less than 10MB');
      return;
    }

    setUploadingReport(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.post('http://localhost:5000/api/medical-records', {
            patientId: user.id,
            patientName: user?.name || user?.firstName || 'Patient',
            recordName: file.name.replace(/\.[^/.]+$/, ''),
            recordType: file.type.includes('pdf') ? 'PDF Report' : 'Image Report',
            fileUrl: reader.result,
            description: 'Patient uploaded medical report',
            doctorName: 'Self'
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (res.data.success) {
            toast.success('Medical report uploaded successfully!');
            fetchMedicalRecords();
          } else {
            toast.error('Failed to upload: ' + (res.data.message || 'Please try again'));
          }
        } catch (err) {
          console.error("Upload error:", err);
          toast.error('Failed to upload report. Please try again.');
        }
        setUploadingReport(false);
      };
      reader.onerror = () => {
        toast.error('Failed to read file');
        setUploadingReport(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error('Failed to upload report');
      setUploadingReport(false);
    }
  };

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [editForm, setEditForm] = useState({ ...user });

  const userName = user?.name || user?.firstName || 'Patient';

  return (
    <div className="flex bg-slate-50 min-h-screen relative overflow-hidden">
      <Toaster position="top-right" />
      <div className="fixed inset-0 z-0"><img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop" className="w-full h-full object-cover opacity-5" alt="bg" /><div className="absolute inset-0 bg-slate-50/90 backdrop-blur-[2px]"></div></div>
      <Sidebar role="Patient" activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-72 p-12 w-full relative z-10">
        <header className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-black text-slate-900 italic">Clinico <span className="text-blue-600">Patient</span> Portal</h1>
            <div className="bg-white p-3 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 pr-10 font-bold uppercase text-xs tracking-widest">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={20}/>
                )}
              </div>
              {userName}
            </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="grid grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border flex items-center gap-4"><Heart className="text-rose-500"/><div><p className="text-[10px] font-black text-slate-400">Heart Rate</p><p className="font-black">{healthMetrics.heartRate} BPM</p></div></div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border flex items-center gap-4"><Droplets className="text-blue-500"/><div><p className="text-[10px] font-black text-slate-400">Glucose</p><p className="font-black">{healthMetrics.glucose} mg/dL</p></div></div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border flex items-center gap-4"><Scale className="text-emerald-500"/><div><p className="text-[10px] font-black text-slate-400">BMI</p><p className="font-black">{healthMetrics.bmi}</p></div></div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border flex items-center gap-4"><Thermometer className="text-orange-500"/><div><p className="text-[10px] font-black text-slate-400">Temp</p><p className="font-black">{healthMetrics.temperature}°F</p></div></div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border">
                    <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic"><Clock className="text-blue-600"/> Upcoming Visits ({myAppointments.length})</h2>
                    <div className="space-y-4">
                        {myAppointments.slice(0, 3).length > 0 ? myAppointments.slice(0, 3).map((app, i) => (
                            <div key={i} className="p-5 bg-slate-50 rounded-2xl border flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm">APT</div>
                                  <div>
                                    <p className="font-black text-slate-800">Dr. {app.doctorName || app.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{app.doctorSpecialization || app.spec} • {app.date} at {app.time}</p>
                                  </div>
                                </div>
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black uppercase">Confirmed</span>
                            </div>
                        )) : (
                          <div className="text-center py-8 text-slate-400">
                            <p>No upcoming appointments</p>
                            <button onClick={() => setActiveTab('booking')} className="mt-2 text-blue-600 text-sm underline">Book Now</button>
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3 italic"><Activity className="text-rose-500"/> Health Tips</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                            <p className="font-bold text-rose-700">Stay Hydrated</p>
                            <p className="text-xs text-rose-600 mt-1">Drink 8 glasses of water daily for better health</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <p className="font-bold text-blue-700">Regular Exercise</p>
                            <p className="text-xs text-blue-600 mt-1">30 min walk daily keeps you active and fit</p>
                        </div>
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <p className="font-bold text-emerald-700">Healthy Diet</p>
                            <p className="text-xs text-emerald-600 mt-1">Include fruits and vegetables in your meals</p>
                        </div>
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <p className="font-bold text-amber-700">Quality Sleep</p>
                            <p className="text-xs text-amber-600 mt-1">Get 7-8 hours of sleep for optimal health</p>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <button onClick={() => setActiveTab('booking')} className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-[3rem] shadow-xl text-white text-left">
                    <p className="text-4xl font-black italic mb-2">Book</p>
                    <p className="font-bold opacity-80">Find & consult a doctor</p>
                  </button>
                  <button onClick={() => setActiveTab('ai')} className="bg-gradient-to-br from-rose-600 to-rose-700 p-8 rounded-[3rem] shadow-xl text-white text-left">
                    <p className="text-4xl font-black italic mb-2">AI Health</p>
                    <p className="font-bold opacity-80">Check your symptoms</p>
                  </button>
                </div>
            </motion.div>
          )}

          {activeTab === 'booking' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border">
                    <h2 className="text-2xl font-black mb-6 italic">Available Doctors</h2>
                    <div className="relative mb-6"><Search className="absolute left-6 top-6 text-slate-400"/><input type="text" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search by name or specialization..." className="w-full p-6 pl-16 bg-slate-50 rounded-2xl border outline-none focus:ring-2 focus:ring-blue-500 font-bold" /></div>
                    <div className="grid grid-cols-3 gap-6">
                        {filteredDoctors.map(doc => (
                            <div key={doc.id} className="bg-slate-50 p-6 rounded-3xl border hover:border-blue-500 transition-all">
                                <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-2xl mx-auto mb-3 object-cover" />
                                <h3 className="text-lg font-black text-slate-800 text-center">{doc.name}</h3>
                                <p className="text-blue-600 font-bold text-xs uppercase text-center mb-3">{doc.spec}</p>
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-slate-500 font-bold">₹{doc.fee}/visit</span>
                                  <span className="flex items-center gap-1 text-yellow-500 font-bold text-xs"><Star size={12} fill="currentColor"/> {doc.rating}</span>
                                </div>
                                <button onClick={() => setBookingDoc(doc)} className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-sm hover:bg-blue-600 transition">Book Now</button>
                            </div>
                        ))}
                    </div>
                </div>
                {bookingDoc && (
                    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-6 font-bold">
                        <div className="bg-white w-full max-w-lg rounded-[3rem] p-8 shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-black italic">Book Appointment</h3>
                                <button onClick={()=>{setBookingDoc(null); setSelectedDate(''); setSelectedTime('');}} className="text-slate-400 hover:text-red-500"><X size={24}/></button>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl mb-6">
                                <img src={bookingDoc.image} alt={bookingDoc.name} className="w-14 h-14 rounded-xl object-cover" />
                                <div>
                                    <p className="font-black text-lg">{bookingDoc.name}</p>
                                    <p className="text-blue-600 text-sm">{bookingDoc.spec} • {bookingDoc.exp} experience</p>
                                </div>
                            </div>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold block mb-2">Select Date</label>
                                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl font-bold" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold block mb-2">Select Time</label>
                                    <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className="w-full p-4 bg-slate-50 rounded-xl font-bold" />
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-bold">Consultation Fee</span>
                                    <span className="text-2xl font-black text-blue-600">₹{bookingDoc.fee}</span>
                                </div>
                            </div>
                            <button onClick={() => setShowPayModal(true)} disabled={!selectedDate || !selectedTime} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed">Pay & Book Appointment</button>
                        </div>
                    </div>
                )}
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {myAppointments.length > 0 ? myAppointments.map((app, i) => (
                    <div key={i} className="flex items-center justify-between p-8 bg-white rounded-[3rem] border shadow-xl">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center font-black italic">APT</div>
                          <div>
                            <p className="text-xl font-black text-slate-800">Dr. {app.doctorName || app.name}</p>
                            <p className="text-sm text-slate-400 font-bold italic tracking-tighter uppercase">{app.doctorSpecialization || app.spec} • {app.date} at {app.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold">Paid</span>
                        </div>
                    </div>
                )) : (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-xl font-bold">No appointments yet</p>
                    <button onClick={() => setActiveTab('booking')} className="mt-4 text-blue-600 underline">Book a doctor</button>
                  </div>
                )}
            </motion.div>
          )}

          {activeTab === 'records' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-12 rounded-[4rem] shadow-xl border">
                <h2 className="text-3xl font-black mb-10 italic underline decoration-blue-200 underline-offset-8">Medical History: {userName}</h2>
                <div className="space-y-4 font-bold">
                    {records.map(rec => (
                        <div key={rec.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-[2.5rem] border hover:bg-white transition-all shadow-sm">
                            <div className="flex items-center gap-5">
                              <div className="p-4 bg-white rounded-2xl text-blue-600 shadow-sm border"><FileText/></div>
                              <div>
                                <p className="font-black text-slate-800">{rec.recordName || rec.name}</p>
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black italic">Patient: {rec.patientName} • {rec.date || rec.date}</p>
                              </div>
                            </div>
                            <button onClick={() => setSelectedRecord(rec)} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-2 rounded-xl text-sm font-black shadow-lg">View Report</button>
                        </div>
                    ))}
                </div>
            </motion.div>
          )}

          {activeTab === 'upload' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-12 rounded-[4rem] shadow-xl border">
                <h2 className="text-3xl font-black mb-10 italic">Upload Documents & Reports</h2>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
                    <input 
                      type="file" 
                      id="profileUpload"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="profileUpload" className="cursor-pointer">
                      <div className="w-24 h-24 bg-blue-50 rounded-full mx-auto flex items-center justify-center mb-4">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <Image size={40} className="text-blue-600"/>
                        )}
                      </div>
                      <p className="font-black text-slate-600">Upload Profile Picture</p>
                      <p className="text-xs text-slate-400 mt-2">JPG, PNG (max 5MB)</p>
                      {uploadingImage && <p className="text-blue-600 text-sm mt-2">Uploading...</p>}
                    </label>
                  </div>

                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2rem] text-center">
                    <input 
                      type="file" 
                      id="reportUpload"
                      accept="image/jpeg,image/png,image/jpg,application/pdf"
                      onChange={handleReportUpload}
                      className="hidden"
                    />
                    <label htmlFor="reportUpload" className="cursor-pointer">
                      <div className="w-24 h-24 bg-indigo-50 rounded-full mx-auto flex items-center justify-center mb-4">
                        {uploadingReport ? (
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                        ) : (
                          <Upload size={40} className="text-indigo-600"/>
                        )}
                      </div>
                      <p className="font-black text-slate-600">Upload Medical Reports</p>
                      <p className="text-xs text-slate-400 mt-2">JPG, PNG, PDF (max 10MB each)</p>
                      {uploadingReport && <p className="text-indigo-600 text-sm mt-2">Uploading...</p>}
                    </label>
                  </div>
                </div>
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <div className="max-w-4xl mx-auto space-y-10">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5"><Bot size={150}/></div>
                    <div className="text-center mb-12">
                        <div className="bg-blue-600 w-20 h-20 rounded-[2rem] mx-auto flex items-center justify-center text-white shadow-xl mb-6"><Bot size={40}/></div>
                        <h2 className="text-4xl font-black italic tracking-tighter">Clinico AI Medical Engine</h2>
                        <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest">Input your symptoms for a smart clinical analysis</p>
                    </div>
                    <textarea 
                        value={symptom} 
                        onChange={(e)=>setSymptom(e.target.value)} 
                        rows="4" 
                        className="w-full p-8 bg-slate-50 rounded-[2.5rem] border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none font-bold italic shadow-inner text-lg transition-all" 
                        placeholder="Describe how you feel... (e.g. Sharp headache, mild fever, chest pain)"
                    ></textarea>
                    <button onClick={getAIAdvice} className="w-full mt-8 bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-blue-600 transition shadow-2xl tracking-tighter italic">Process Symptoms & Run Diagnosis</button>
                </div>

                {aiResult && (
                    <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-12 rounded-[4rem] shadow-2xl border-2 border-blue-50 relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-2 ${aiResult.severity === 'Moderate' ? 'bg-orange-400' : 'bg-blue-500'}`}></div>
                        <div className="flex items-center gap-4 mb-10">
                            <div className="bg-blue-50 p-4 rounded-3xl text-blue-600 shadow-sm"><Activity size={30}/></div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 italic">Analysis: {aiResult.condition}</h3>
                                <p className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] mt-1">Severity Status: {aiResult.severity}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-bold">
                            <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                <h4 className="flex items-center gap-2 text-blue-600 uppercase text-xs tracking-widest mb-6"><Pill size={18}/> Suggested Medication</h4>
                                <p className="text-xl text-slate-700 italic leading-relaxed">{aiResult.medicine}</p>
                            </div>
                            <div className="p-8 bg-blue-50/30 rounded-[2.5rem] border border-blue-50">
                                <h4 className="flex items-center gap-2 text-emerald-600 uppercase text-xs tracking-widest mb-6"><CheckCircle2 size={18}/> Recommended Practices</h4>
                                <ul className="space-y-4">
                                    {aiResult.practices.map((p, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-slate-600 text-sm italic">
                                            <span className="bg-white w-2 h-2 rounded-full mt-1.5 shadow-sm border border-emerald-200"></span>
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-10 p-6 bg-rose-50 rounded-3xl flex items-center gap-4 border border-rose-100">
                            <AlertCircle className="text-rose-500" size={24}/>
                            <p className="text-rose-700 font-bold text-xs italic uppercase">Note: This is an AI prediction. Please consult a specialist doctor for accurate medical diagnosis.</p>
                        </div>
                    </motion.div>
                )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 font-bold">
                <div className="bg-white p-10 rounded-[3.5rem] shadow-xl">
                    <h2 className="text-2xl font-black mb-8 italic">My Profile</h2>
                    <div className="flex items-start gap-10">
                        <div className="text-center">
                            <div className="w-32 h-32 bg-blue-50 text-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-inner overflow-hidden relative">
                              {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                <User size={50}/>
                              )}
                              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-xl cursor-pointer hover:bg-blue-700">
                                <Edit3 size={14}/>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                              </label>
                            </div>
                            <p className="text-xs text-slate-400">Click icon to change photo</p>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] text-slate-400 uppercase mb-1">Full Name</p>
                                    <p className="font-black text-lg">{userName}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] text-slate-400 uppercase mb-1">Email</p>
                                    <p className="font-black text-lg">{user?.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] text-slate-400 uppercase mb-1">Role</p>
                                    <p className="font-black text-lg">Patient</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl">
                                    <p className="text-[10px] text-slate-400 uppercase mb-1">Member Since</p>
                                    <p className="font-black text-lg">{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[3.5rem] shadow-xl">
                    <h2 className="text-2xl font-black mb-6 italic">Account Settings</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                            <div>
                                <p className="font-black">Email Notifications</p>
                                <p className="text-xs text-slate-400">Receive appointment reminders</p>
                            </div>
                            <button onClick={()=>setEmailAlerts(!emailAlerts)} className={`w-12 h-6 rounded-full p-1 transition-all ${emailAlerts ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full transition-all ${emailAlerts ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                            <div>
                                <p className="font-black">Two-Factor Authentication</p>
                                <p className="text-xs text-slate-400">Add extra security to your account</p>
                            </div>
                            <button className="text-blue-600 font-bold text-sm">Enable</button>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </AnimatePresence>

        {showPayModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 font-bold">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-md rounded-[3.5rem] p-12 shadow-2xl relative">
                    <button onClick={() => setShowPayModal(false)} className="absolute top-10 right-10 text-slate-400"><X/></button>
                    <h2 className="text-3xl font-black italic mb-6 text-center">Clinico Pay</h2>
                    <div className="bg-blue-50 p-4 rounded-2xl mb-6">
                      <p className="text-center text-blue-600 font-bold">Appointment with Dr. {bookingDoc?.name}</p>
                      <p className="text-center text-blue-600">Date: {selectedDate} at {selectedTime}</p>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-2xl border focus-within:border-blue-600">
                          <p className="text-[10px] text-slate-400 uppercase">Card Holder Name</p>
                          <input type="text" className="bg-transparent w-full outline-none" defaultValue={userName} />
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border focus-within:border-blue-600">
                          <p className="text-[10px] text-slate-400 uppercase">Card Number</p>
                          <input type="text" className="bg-transparent w-full outline-none" placeholder="XXXX XXXX XXXX XXXX" maxLength={19} />
                        </div>
                        <div className="flex gap-4">
                          <div className="p-4 bg-slate-50 rounded-2xl border focus-within:border-blue-600 flex-1">
                            <p className="text-[10px] text-slate-400 uppercase">Expiry</p>
                            <input type="text" className="bg-transparent w-full outline-none" placeholder="MM/YY" maxLength={5} />
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border focus-within:border-blue-600 flex-1">
                            <p className="text-[10px] text-slate-400 uppercase">CVV</p>
                            <input type="password" className="bg-transparent w-full outline-none" placeholder="***" maxLength={3} />
                          </div>
                        </div>
                        <button onClick={handlePayment} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl flex items-center justify-center gap-3">Pay ₹{bookingDoc?.fee} Securely <Lock size={20}/></button>
                        <p className="text-center text-xs text-slate-400 mt-2">Secure payment powered by Clinico</p>
                    </div>
                </motion.div>
            </div>
        )}

        {selectedRecord && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 font-bold">
                <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="bg-white w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-2xl">
                    <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-black italic">{selectedRecord.recordName || selectedRecord.name}</h2>
                        <p className="text-xs text-blue-400 uppercase tracking-widest mt-1 italic">Patient: {selectedRecord.patientName}</p>
                      </div>
                      <button onClick={()=>setSelectedRecord(null)} className="p-4 bg-white/10 rounded-2xl"><X/></button>
                    </div>
                    <div className="p-12 space-y-8 overflow-y-auto max-h-[60vh]">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 bg-slate-50 rounded-3xl shadow-sm border">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Reason</p>
                            <p>{selectedRecord.issue}</p>
                          </div>
                          <div className="p-6 bg-slate-50 rounded-3xl shadow-sm border">
                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Authorized By</p>
                            <p>Dr. {selectedRecord.dr}</p>
                          </div>
                        </div>
                        <div className="bg-blue-50/50 p-10 rounded-[3rem] border-2 border-blue-100">
                          <p className="text-blue-600 text-xs font-black uppercase mb-6 tracking-widest underline underline-offset-8 decoration-blue-200">Analysis & Prescriptions</p>
                          <p className="text-slate-700 italic leading-relaxed text-lg">• Report Status: {selectedRecord.res}<br/>• Treatment: {selectedRecord.meds}</p>
                        </div>
                    </div>
                    <div className="p-10 text-center bg-slate-50 border-t"><button onClick={()=>setSelectedRecord(null)} className="bg-slate-900 text-white px-12 py-4 rounded-[2rem] font-black tracking-tighter shadow-xl">Close Medical Record</button></div>
                </motion.div>
            </div>
        )}

        {showEditModal && (
            <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 font-bold">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-xl rounded-[3.5rem] p-12 relative shadow-2xl border">
                    <button onClick={() => setShowEditModal(false)} className="absolute top-10 right-10 text-slate-400 hover:text-red-500"><X size={24}/></button>
                    <h2 className="text-3xl font-black mb-10 text-slate-800 italic tracking-tighter">Portal Account Settings</h2>
                    <div className="space-y-6">
                        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest italic">Full Name</label>
          <input type="text" value={editForm.name || userName} onChange={(e)=>setEditForm({...editForm, name: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-black shadow-inner" />
        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest italic">Email ID</label>
                          <input type="email" value={user?.email || ''} disabled className="w-full p-5 bg-slate-100 rounded-2xl outline-none font-black shadow-inner text-slate-400" />
                        </div>
                        <button onClick={()=>{setUser({...editForm}); setShowEditModal(false); toast.success("Updated!")}} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-200 mt-6 italic">Save & Sync Portal</button>
                    </div>
                </motion.div>
            </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;