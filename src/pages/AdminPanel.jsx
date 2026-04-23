import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Users, UserCheck, CalendarDays, Search, 
  Trash2, CheckCircle, Clock, DollarSign, Activity, 
  User, Mail, ShieldCheck, MoreVertical, Star, Loader2 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState("");
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // 1. DYNAMIC DOCTORS LIST (11 DOCTORS)
  const [doctorsList, setDoctorsList] = useState([
    { id: 1, name: 'Priyanshu', spec: 'Senior Surgeon', status: 'Approved', joined: 'Oct 2023' },
    { id: 2, name: 'Sarah Smith', spec: 'Cardiologist', status: 'Approved', joined: 'Nov 2023' },
    { id: 3, name: 'James Wilson', spec: 'Neurologist', status: 'Pending', joined: 'Yesterday' },
    { id: 4, name: 'Emily Davis', spec: 'Dermatologist', status: 'Approved', joined: 'Dec 2023' },
    { id: 5, name: 'Robert Fox', spec: 'Pediatrician', status: 'Pending', joined: 'Today' },
    { id: 6, name: 'Michael Brown', spec: 'Orthopedic', status: 'Approved', joined: 'Jan 2024' },
    { id: 7, name: 'Sophia Grey', spec: 'Psychiatrist', status: 'Approved', joined: 'Feb 2024' },
    { id: 8, name: 'Linda Green', spec: 'Dentist', status: 'Approved', joined: 'Mar 2024' },
    { id: 9, name: 'David Miller', spec: 'Oncologist', status: 'Pending', joined: 'Today' },
    { id: 10, name: 'Chris Evans', spec: 'Physician', status: 'Approved', joined: 'April 2024' },
    { id: 11, name: 'Anna Lee', spec: 'Gynecologist', status: 'Approved', joined: 'May 2024' },
  ]);

  // 2. SEARCH FILTER LOGIC
  const filteredDocs = doctorsList.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.spec.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. ACTION FUNCTIONS
  const approveDoctor = (id) => {
    setDoctorsList(doctorsList.map(d => d.id === id ? { ...d, status: 'Approved' } : d));
    toast.success("Doctor status updated to Approved!");
  };

  const removeDoctor = (id) => {
    setDoctorsList(doctorsList.filter(d => d.id !== id));
    toast.error("Doctor profile purged from system");
  };

  const runDiagnostics = () => {
    setIsDiagnosing(true);
    toast.loading("Scanning core database and security layers...");
    setTimeout(() => {
        toast.dismiss();
        setIsDiagnosing(false);
        toast.success("System Health: 100% | All Services Online");
    }, 3000);
  };

  return (
    <div className="flex bg-slate-50 min-h-screen relative overflow-hidden font-sans">
      <Toaster position="top-right" />
      
      <Sidebar role="Admin" activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-72 p-12 w-full relative z-10">
        {/* Header with Your Name Fixed */}
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Clinico <span className="text-blue-600 uppercase">Admin</span></h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Enterprise Resource Monitor</p>
          </div>
          <div className="bg-white p-3 rounded-3xl shadow-sm border flex items-center gap-4 pr-10 font-black">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white"><ShieldCheck size={20}/></div>
            <div>
                {/* 👈 FIXED: Showing your name and role strictly */}
                <p className="text-xs">Priyanshu</p>
                <p className="text-[8px] text-blue-600 font-black uppercase tracking-widest">System Admin</p>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                <div className="grid grid-cols-4 gap-8">
                    {[
                      { l: 'Revenue', v: '₹1,24,500', i: <TrendingUp/>, c: 'bg-emerald-50 text-emerald-600' },
                      { l: 'Verified Doctors', v: '11', i: <UserCheck/>, c: 'bg-blue-50 text-blue-600' },
                      { l: 'Patient Count', v: '2,401', i: <Users/>, c: 'bg-indigo-50 text-indigo-600' },
                      { l: 'Global Visits', v: '840', i: <CalendarDays/>, c: 'bg-orange-50 text-orange-600' }
                    ].map((s, i) => (
                        <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-white">
                            <div className={`${s.c} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>{s.i}</div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.l}</p>
                            <p className="text-3xl font-black text-slate-800 mt-1">{s.v}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border">
                        <h2 className="text-2xl font-black mb-8 italic flex items-center gap-3"><Clock className="text-blue-600"/> Platform Activity Feed</h2>
                        <div className="space-y-6">
                            {[
                                { t: "Senior Physician Onboarded: Dr. Priyanshu", time: "Just now", color: "border-blue-500" },
                                { t: "Transaction Processed: ₹2,000", time: "12 mins ago", color: "border-emerald-500" },
                                { t: "New Appointment Logged: Visit #1021", time: "2 hours ago", color: "border-orange-500" }
                            ].map((act, i) => (
                                <div key={i} className={`flex items-center justify-between border-l-4 ${act.color} pl-6 py-2 bg-slate-50 rounded-r-2xl`}>
                                    <p className="text-sm font-bold text-slate-700">{act.t}</p>
                                    <span className="text-[9px] font-black text-slate-400 uppercase">{act.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white relative overflow-hidden">
                        <h2 className="text-2xl font-black italic">System Health Portal</h2>
                        <p className="mt-4 text-slate-400 font-bold italic">Identify security vulnerabilities and audit server response times.</p>
                        <button 
                            onClick={runDiagnostics} 
                            disabled={isDiagnosing}
                            className="mt-10 bg-blue-600 px-10 py-5 rounded-3xl font-black text-lg hover:bg-white hover:text-blue-600 transition-all flex items-center gap-3 shadow-2xl"
                        >
                            {isDiagnosing ? <Loader2 className="animate-spin"/> : <Activity size={22}/>} 
                            {isDiagnosing ? "Scanning Layers..." : "Run System Diagnostics"}
                        </button>
                    </div>
                </div>
            </motion.div>
          )}

          {/* TAB: MANAGE DOCTORS */}
          {activeTab === 'doctors' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-12 rounded-[4rem] shadow-xl border">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-black italic underline decoration-blue-200 underline-offset-8">Physician Directory</h2>
                    <div className="relative w-1/3">
                        <Search className="absolute left-5 top-4 text-slate-400" size={20}/>
                        <input type="text" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Live Filter by Name..." className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm" />
                    </div>
                </div>
                <table className="w-full text-left font-bold">
                    <thead>
                        <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b">
                            <th className="pb-6">Medical Professional</th>
                            <th className="pb-6">Registration</th>
                            <th className="pb-6">Portal Status</th>
                            <th className="pb-6 text-right">System Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredDocs.map((doc) => (
                            <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-6 flex items-center gap-4"><div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black">DR</div><div><p>{doc.name}</p><p className="text-[9px] uppercase text-slate-400 tracking-tighter">{doc.spec}</p></div></td>
                                <td className="py-6 text-slate-500 italic text-sm">{doc.joined}</td>
                                <td className="py-6"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase shadow-sm ${doc.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-600 animate-pulse'}`}>{doc.status}</span></td>
                                <td className="py-6 text-right space-x-3">
                                    {doc.status !== 'Approved' && <button onClick={() => approveDoctor(doc.id)} className="p-3 bg-white text-emerald-600 rounded-xl border hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Approve"><CheckCircle size={18}/></button>}
                                    <button onClick={() => removeDoctor(doc.id)} className="p-3 bg-white text-rose-500 rounded-xl border hover:bg-rose-500 hover:text-white transition-all shadow-sm" title="Remove"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
          )}

          {/* TAB: MANAGE PATIENTS */}
          {activeTab === 'patients' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-12 rounded-[4rem] shadow-xl border grid grid-cols-2 gap-8">
                {['Rahul Sharma', 'Aditya Roy', 'Priyanshu Gupta', 'Emily Davis', 'Siddharth Jain'].map((name, i) => (
                    <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border flex justify-between items-center hover:bg-white hover:shadow-xl transition-all group">
                        <div className="flex items-center gap-5"><div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black group-hover:bg-blue-600 transition-colors">P</div><div><p className="text-xl font-black italic">{name}</p><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{name.split(' ')[0].toLowerCase()}@clinico.com</p></div></div>
                        <div className="text-right font-black"><p className="text-2xl text-blue-600">{i*5 + 2}</p><p className="text-[9px] uppercase text-slate-400">Past Visits</p></div>
                    </div>
                ))}
             </motion.div>
          )}

          {/* TAB: APPOINTMENTS */}
          {activeTab === 'admin-appts' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h2 className="text-3xl font-black italic mb-8 ml-4 underline underline-offset-8">Global Service Audit</h2>
                {[
                  { d: 'Priyanshu', p: 'Rahul Sharma', f: '2000', st: 'Verified' },
                  { d: 'Sarah Smith', p: 'Aditya Roy', f: '1200', st: 'Paid' },
                  { d: 'James Wilson', p: 'Emily Davis', f: '1500', st: 'Verified' }
                ].map((a, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-white flex justify-between items-center">
                        <div className="flex items-center gap-10 font-bold">
                            <div><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Assigned MD</p><p className="text-slate-800 italic">Dr. {a.d}</p></div>
                            <div className="w-px h-10 bg-slate-100"></div>
                            <div><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Patient</p><p className="text-slate-800">{a.p}</p></div>
                        </div>
                        <div className="flex items-center gap-10 font-black">
                            <div className="text-right"><p className="text-[9px] text-slate-400 uppercase">Consult Fee</p><p className="text-xl text-blue-600 tracking-tighter">₹{a.f}</p></div>
                            <span className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-2xl text-[9px] uppercase shadow-sm italic">{a.st}</span>
                        </div>
                    </div>
                ))}
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminPanel;
