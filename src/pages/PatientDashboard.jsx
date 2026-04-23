import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Calendar, Pill, FileText, Bot, Settings, User, Video, Heart, 
  Activity, X, Edit3, ShieldCheck, Eye, Star, Clock, CreditCard, Lock, 
  Thermometer, Droplets, Scale, Download, CheckCircle2, AlertCircle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const PatientDashboard = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [bookingDoc, setBookingDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [myAppointments, setMyAppointments] = useState([
    { name: 'Sarah Smith', spec: 'Cardiology', time: '04:30 PM', date: '24 Oct', status: 'Confirmed' },
    { name: 'Priyanshu', spec: 'Senior Surgeon', time: '10:00 AM', date: '25 Oct', status: 'Confirmed' }
  ]);

  // --- ADVANCED AI CONSULT LOGIC ---
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

  // --- REST OF THE LOGIC (REMAINING THE SAME) ---
  const doctors = [
    { id: 1, name: 'Priyanshu', spec: 'Senior Surgeon', fee: '2000', rating: '5.0', exp: '15 Yrs' },
    { id: 2, name: 'Sarah Smith', spec: 'Cardiologist', fee: '1200', rating: '4.9', exp: '10 Yrs' },
    { id: 3, name: 'James Wilson', spec: 'Neurologist', fee: '1500', rating: '4.8', exp: '12 Yrs' },
    { id: 4, name: 'Emily Davis', spec: 'Dermatologist', fee: '1000', rating: '4.7', exp: '8 Yrs' },
    { id: 5, name: 'Robert Fox', spec: 'Pediatrician', fee: '900', rating: '4.9', exp: '15 Yrs' },
    { id: 6, name: 'Michael Brown', spec: 'Orthopedic', fee: '1300', rating: '4.6', exp: '11 Yrs' },
    { id: 7, name: 'Sophia Grey', spec: 'Psychiatrist', fee: '1800', rating: '4.9', exp: '14 Yrs' },
    { id: 8, name: 'Linda Green', spec: 'Dentist', fee: '800', rating: '4.5', exp: '7 Yrs' },
    { id: 9, name: 'David Miller', spec: 'Oncologist', fee: '2500', rating: '5.0', exp: '20 Yrs' },
    { id: 10, name: 'Chris Evans', spec: 'Physician', fee: '700', rating: '4.4', exp: '5 Yrs' },
    { id: 11, name: 'Anna Lee', spec: 'Gynecologist', fee: '1400', rating: '4.8', exp: '10 Yrs' },
  ];
  const filteredDoctors = doctors.filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.spec.toLowerCase().includes(searchTerm.toLowerCase()));
  const medicalRecords = [
    { id: 1, name: 'Full Blood Count', date: 'Oct 12, 2024', dr: 'Hospital Lab', issue: 'Anemia Check', res: 'Normal', meds: 'Iron Supplements' },
    { id: 2, name: 'MRI Brain Scan', date: 'Sep 28, 2024', dr: 'James Wilson', issue: 'Chronic Migraine', res: 'Mild Sinusitis', meds: 'Naproxen 500mg' },
    { id: 3, name: 'Cardiac Stress Test', date: 'Aug 15, 2024', dr: 'Sarah Smith', issue: 'Chest Tightness', res: 'Healthy Rhythm', meds: 'None' },
    { id: 4, name: 'Gallbladder Review', date: 'Jul 05, 2024', dr: 'Priyanshu', issue: 'Post-Surgery Followup', res: 'Full Recovery', meds: 'Antacids' }
  ];
  const handlePayment = () => {
    toast.loading("Processing Payment...");
    setTimeout(() => {
        toast.dismiss();
        setMyAppointments([{ name: bookingDoc.name, spec: bookingDoc.spec, time: '11:30 AM', date: 'Next Mon', status: 'Confirmed' }, ...myAppointments]);
        toast.success("Appointment Confirmed!");
        setShowPayModal(false);
        setBookingDoc(null);
    }, 2000);
  };

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [editForm, setEditForm] = useState({ ...user });

  return (
    <div className="flex bg-slate-50 min-h-screen relative overflow-hidden">
      <Toaster position="top-right" />
      <div className="fixed inset-0 z-0"><img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop" className="w-full h-full object-cover opacity-5" alt="bg" /><div className="absolute inset-0 bg-slate-50/90 backdrop-blur-[2px]"></div></div>
      <Sidebar role="Patient" activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-72 p-12 w-full relative z-10">
        <header className="flex justify-between items-center mb-12">
            <h1 className="text-4xl font-black text-slate-900 italic">Clinico <span className="text-blue-600">Patient</span> Portal</h1>
            <div className="bg-white p-3 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 pr-10 font-bold uppercase text-xs tracking-widest"><div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"><User size={20}/></div>{user?.firstName}</div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="grid grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border flex items-center gap-4"><Heart className="text-rose-500"/><div><p className="text-[10px] font-black text-slate-400">Heart Rate</p><p className="font-black">72 BPM</p></div></div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border flex items-center gap-4"><Droplets className="text-blue-500"/><div><p className="text-[10px] font-black text-slate-400">Glucose</p><p className="font-black">110 mg/dL</p></div></div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border flex items-center gap-4"><Scale className="text-emerald-500"/><div><p className="text-[10px] font-black text-slate-400">BMI</p><p className="font-black">22.4</p></div></div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl border flex items-center gap-4"><Thermometer className="text-orange-500"/><div><p className="text-[10px] font-black text-slate-400">Temp</p><p className="font-black">98.6°F</p></div></div>
                </div>
                <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border">
                    <h2 className="text-2xl font-black mb-8 flex items-center gap-3 italic"><Clock className="text-blue-600"/> Upcoming Visits</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {myAppointments.slice(0, 4).map((app, i) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-3xl border flex justify-between items-center">
                                <div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black">Visit</div><div><p className="font-black text-slate-800">Dr. {app.name}</p><p className="text-[10px] text-slate-400 font-bold uppercase">{app.spec} • {app.time}</p></div></div>
                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[9px] font-black uppercase">Confirmed</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
          )}

          {activeTab === 'booking' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div className="relative"><Search className="absolute left-6 top-6 text-slate-400"/><input type="text" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search specialists..." className="w-full p-6 pl-16 bg-white rounded-3xl border shadow-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold" /></div>
                <div className="grid grid-cols-3 gap-8">
                    {filteredDoctors.map(doc => (
                        <div key={doc.id} className="bg-white p-8 rounded-[3rem] shadow-xl border group hover:bg-slate-900 transition-all duration-500">
                            <h3 className="text-xl font-black text-slate-800 group-hover:text-white italic">Dr. {doc.name}</h3>
                            <p className="text-blue-600 font-black text-[10px] uppercase mt-1 mb-6 tracking-widest">{doc.spec}</p>
                            <button onClick={() => setBookingDoc(doc)} className="w-full bg-slate-100 text-slate-900 py-4 rounded-2xl font-black group-hover:bg-blue-600 group-hover:text-white transition-all">Book Appointment</button>
                        </div>
                    ))}
                </div>
                {bookingDoc && (
                    <div className="fixed bottom-0 left-72 right-0 p-8 bg-white border-t rounded-t-[4rem] z-40 flex justify-between items-center shadow-2xl">
                        <div><h3 className="text-2xl font-black italic">Scheduling with <span className="text-blue-600">Dr. {bookingDoc.name}</span></h3><div className="flex gap-4 mt-4"><input type="date" className="p-3 bg-slate-50 rounded-xl font-bold" /><input type="time" className="p-3 bg-slate-50 rounded-xl font-bold" /></div></div>
                        <div><p className="text-slate-400 font-bold mb-2 uppercase text-xs tracking-widest">Fee: ₹{bookingDoc.fee}</p><button onClick={() => setShowPayModal(true)} className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-xl hover:bg-blue-600 transition shadow-xl">Proceed to Pay</button><button onClick={()=>setBookingDoc(null)} className="ml-4 text-red-500 font-bold">Cancel</button></div>
                    </div>
                )}
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {myAppointments.map((app, i) => (
                    <div key={i} className="flex items-center justify-between p-8 bg-white rounded-[3rem] border shadow-xl">
                        <div className="flex items-center gap-6"><div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center font-black italic">APT</div><div><p className="text-xl font-black text-slate-800">Dr. {app.name}</p><p className="text-sm text-slate-400 font-bold italic tracking-tighter uppercase">{app.spec} • {app.date} at {app.time}</p></div></div>
                        <button onClick={() => window.open('/video-visit', '_blank')} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-slate-900 transition flex items-center gap-2 tracking-tighter italic">Join Video Call <Video size={18}/></button>
                    </div>
                ))}
            </motion.div>
          )}

          {activeTab === 'records' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-12 rounded-[4rem] shadow-xl border">
                <h2 className="text-3xl font-black mb-10 italic underline decoration-blue-200 underline-offset-8">Medical History: {user?.firstName}</h2>
                <div className="space-y-4 font-bold">
                    {medicalRecords.map(rec => (
                        <div key={rec.id} className="flex justify-between items-center p-6 bg-slate-50 rounded-[2.5rem] border hover:bg-white transition-all shadow-sm">
                            <div className="flex items-center gap-5"><div className="p-4 bg-white rounded-2xl text-blue-600 shadow-sm border"><FileText/></div><div><p className="font-black text-slate-800">{rec.name}</p><p className="text-[9px] text-slate-400 uppercase tracking-widest font-black italic">Lab Verified • {rec.date}</p></div></div>
                            <button onClick={() => setSelectedRecord(rec)} className="flex items-center gap-2 bg-slate-900 text-white px-8 py-2 rounded-xl text-sm font-black shadow-lg">View Report</button>
                        </div>
                    ))}
                </div>
            </motion.div>
          )}

          {/* --- ENHANCED AI CONSULT --- */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-bold">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-xl text-center">
                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-inner"><User size={40}/></div>
                    <h3 className="text-2xl font-black">{user?.firstName}</h3>
                    <p className="text-slate-400 italic mb-8">{user?.email}</p>
                    <button onClick={() => setShowEditModal(true)} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black hover:bg-blue-600 transition shadow-xl flex items-center justify-center gap-2 tracking-tighter italic"><Edit3 size={18}/> Edit Portal Profile</button>
                </div>
                <div className="bg-white p-12 rounded-[3.5rem] shadow-xl space-y-8">
                    <h3 className="text-2xl font-black flex items-center gap-3"><ShieldCheck className="text-indigo-600"/> Security Control</h3>
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl font-black text-slate-700"><span>Email Notification</span> <button onClick={()=>setEmailAlerts(!emailAlerts)} className={`w-12 h-6 rounded-full p-1 transition-all ${emailAlerts ? 'bg-blue-600' : 'bg-slate-300'}`}><div className={`w-4 h-4 bg-white rounded-full transition-all ${emailAlerts ? 'translate-x-6' : 'translate-x-0'}`}></div></button></div>
                    <button className="w-full p-6 bg-slate-900 text-white rounded-[2rem] font-black hover:bg-blue-600 transition tracking-tighter italic">Change Security Password</button>
                </div>
            </div>
          )}
        </AnimatePresence>

        {/* MODALS */}
        {showPayModal && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 font-bold">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-md rounded-[3.5rem] p-12 shadow-2xl relative">
                    <button onClick={() => setShowPayModal(false)} className="absolute top-10 right-10 text-slate-400"><X/></button>
                    <h2 className="text-3xl font-black italic mb-10 text-center">Clinico Pay</h2>
                    <div className="space-y-6">
                        <div className="p-4 bg-slate-50 rounded-2xl border focus-within:border-blue-600"><p className="text-[10px] text-slate-400 uppercase">Card Holder</p><input type="text" className="bg-transparent w-full outline-none" defaultValue={user?.firstName} /></div>
                        <div className="p-4 bg-slate-50 rounded-2xl border focus-within:border-blue-600"><p className="text-[10px] text-slate-400 uppercase">Card Number</p><input type="text" className="bg-transparent w-full outline-none" placeholder="XXXX XXXX XXXX XXXX" /></div>
                        <button onClick={handlePayment} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl flex items-center justify-center gap-3">Pay ₹{bookingDoc?.fee} Securely <Lock size={20}/></button>
                    </div>
                </motion.div>
            </div>
        )}

        {selectedRecord && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 font-bold">
                <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="bg-white w-full max-w-2xl rounded-[4rem] overflow-hidden shadow-2xl">
                    <div className="bg-slate-900 p-10 text-white flex justify-between items-center"><div><h2 className="text-2xl font-black italic">{selectedRecord.name}</h2><p className="text-xs text-blue-400 uppercase tracking-widest mt-1 italic">Clinical Verification Complete</p></div><button onClick={()=>setSelectedRecord(null)} className="p-4 bg-white/10 rounded-2xl"><X/></button></div>
                    <div className="p-12 space-y-8 overflow-y-auto max-h-[60vh]">
                        <div className="grid grid-cols-2 gap-4"><div className="p-6 bg-slate-50 rounded-3xl shadow-sm border"><p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Reason</p><p>{selectedRecord.issue}</p></div><div className="p-6 bg-slate-50 rounded-3xl shadow-sm border"><p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Authorized By</p><p>Dr. {selectedRecord.dr}</p></div></div>
                        <div className="bg-blue-50/50 p-10 rounded-[3rem] border-2 border-blue-100"><p className="text-blue-600 text-xs font-black uppercase mb-6 tracking-widest underline underline-offset-8 decoration-blue-200">Analysis & Prescriptions</p><p className="text-slate-700 italic leading-relaxed text-lg">• Report Status: {selectedRecord.res}<br/>• Treatment: {selectedRecord.meds}</p></div>
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
                        <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest italic">Full Name</label><input type="text" value={editForm.firstName} onChange={(e)=>setEditForm({...editForm, firstName: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-black shadow-inner" /></div>
                        <div><label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest italic">Email ID</label><input type="email" value={editForm.email} onChange={(e)=>setEditForm({...editForm, email: e.target.value})} className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-black shadow-inner" /></div>
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