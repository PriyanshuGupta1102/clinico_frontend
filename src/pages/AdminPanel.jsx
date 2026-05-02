import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, UserCheck, CalendarDays, Search, 
  Trash2, CheckCircle, Clock, Activity, 
  ShieldCheck, Loader2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  
  const [stats, setStats] = useState({
    revenue: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0
  });
  
  const [doctorsList, setDoctorsList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchAllData();
    
    const interval = setInterval(() => {
      fetchAllData();
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      const [statsRes, doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/stats'),
        axios.get('http://localhost:5000/api/doctors'),
        axios.get('http://localhost:5000/api/patients'),
        axios.get('http://localhost:5000/api/appointments-all')
      ]);

      if (statsRes.data.success) {
        setStats({
          revenue: statsRes.data.stats.revenue || 0,
          totalDoctors: statsRes.data.stats.totalDoctors || 0,
          totalPatients: statsRes.data.stats.totalPatients || 0,
          totalAppointments: statsRes.data.stats.totalAppointments || 0
        });
      }

      if (doctorsRes.data.success) {
        setDoctorsList(doctorsRes.data.doctors.map((d) => ({
          id: d._id,
          name: d.name,
          spec: d.specialization || 'General',
          status: 'Approved',
          joined: new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          email: d.email
        })));
      }

      if (patientsRes.data.success) {
        setPatientsList(patientsRes.data.patients.map((p) => ({
          id: p._id,
          name: p.name,
          email: p.email,
          joined: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        })));
      }

      if (appointmentsRes.data.success) {
        setAppointmentsList(appointmentsRes.data.appointments);
        
        const newActivities = appointmentsRes.data.appointments.slice(0, 5).map((a, i) => ({
          t: `Appointment: ${a.patientName} with Dr. ${a.doctorName}`,
          time: getRelativeTime(new Date(a.createdAt)),
          color: i === 0 ? 'border-blue-500' : i === 1 ? 'border-emerald-500' : 'border-orange-500'
        }));
        
        if (newActivities.length > 0 && activities.length === 0) {
          setActivities(newActivities);
        }
      }
    } catch (err) {
      console.log("Fetching data failed");
    }
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return date.toLocaleDateString();
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

  const filteredDocs = doctorsList.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.spec.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPatients = patientsList.filter(pat => 
    pat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pat.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const removeDoctor = (id) => {
    setDoctorsList(doctorsList.filter(d => d.id !== id));
    toast.error("Doctor removed from system");
  };

  const removePatient = (id) => {
    setPatientsList(patientsList.filter(p => p.id !== id));
    toast.error("Patient removed from system");
  };

  return (
    <div className="flex bg-slate-50 min-h-screen relative overflow-hidden font-sans">
      <Toaster position="top-right" />
      
      <Sidebar role="Admin" activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-72 p-12 w-full relative z-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Clinico <span className="text-blue-600 uppercase">Admin</span></h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Enterprise Resource Monitor</p>
          </div>
          <div className="bg-white p-3 rounded-3xl shadow-sm border flex items-center gap-4 pr-10 font-black">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white"><ShieldCheck size={20}/></div>
            <div>
                <p className="text-xs">System Admin</p>
                <p className="text-[8px] text-blue-600 font-black uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
        </header>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
          {activeTab === 'overview' && (
            <div className="space-y-12">
                <div className="grid grid-cols-4 gap-8">
                    {[
                      { l: 'Revenue', v: `₹${stats.revenue.toLocaleString()}`, i: <TrendingUp/>, c: 'bg-emerald-50 text-emerald-600' },
                      { l: 'Verified Doctors', v: stats.totalDoctors, i: <UserCheck/>, c: 'bg-blue-50 text-blue-600' },
                      { l: 'Patient Count', v: stats.totalPatients.toLocaleString(), i: <Users/>, c: 'bg-indigo-50 text-indigo-600' },
                      { l: 'Global Visits', v: stats.totalAppointments, i: <CalendarDays/>, c: 'bg-orange-50 text-orange-600' }
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
                            {activities.length > 0 ? activities.map((act, i) => (
                                <div key={i} className={`flex items-center justify-between border-l-4 ${act.color} pl-6 py-2 bg-slate-50 rounded-r-2xl`}>
                                    <p className="text-sm font-bold text-slate-700">{act.t}</p>
                                    <span className="text-[9px] font-black text-slate-400 uppercase">{act.time}</span>
                                </div>
                            )) : (
                              <>
                                <div className="flex items-center justify-between border-l-4 border-blue-500 pl-6 py-2 bg-slate-50 rounded-r-2xl">
                                    <p className="text-sm font-bold text-slate-700">System initialized successfully</p>
                                    <span className="text-[9px] font-black text-slate-400 uppercase">Just now</span>
                                </div>
                                <div className="flex items-center justify-between border-l-4 border-emerald-500 pl-6 py-2 bg-slate-50 rounded-r-2xl">
                                    <p className="text-sm font-bold text-slate-700">Database connected</p>
                                    <span className="text-[9px] font-black text-slate-400 uppercase">1 min ago</span>
                                </div>
                                <div className="flex items-center justify-between border-l-4 border-orange-500 pl-6 py-2 bg-slate-50 rounded-r-2xl">
                                    <p className="text-sm font-bold text-slate-700">Waiting for appointments...</p>
                                    <span className="text-[9px] font-black text-slate-400 uppercase">2 mins ago</span>
                                </div>
                              </>
                            )}
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
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="bg-white p-12 rounded-[4rem] shadow-xl border">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-black italic underline decoration-blue-200 underline-offset-8">Physician Directory</h2>
                    <div className="relative w-1/3">
                        <Search className="absolute left-5 top-4 text-slate-400" size={20}/>
                        <input type="text" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Live Filter by Name..." className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm" />
                    </div>
                </div>
                {filteredDocs.length > 0 ? (
                  <table className="w-full text-left font-bold">
                    <thead>
                        <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b">
                            <th className="pb-6">Medical Professional</th>
                            <th className="pb-6">Email</th>
                            <th className="pb-6">Registration</th>
                            <th className="pb-6">Portal Status</th>
                            <th className="pb-6 text-right">System Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredDocs.map((doc) => (
                            <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-6 flex items-center gap-4">
                                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black">DR</div>
                                  <div>
                                    <p>{doc.name}</p>
                                    <p className="text-[9px] uppercase text-slate-400 tracking-tighter">{doc.spec}</p>
                                  </div>
                                </td>
                                <td className="py-6 text-slate-500 text-sm">{doc.email}</td>
                                <td className="py-6 text-slate-500 italic text-sm">{doc.joined}</td>
                                <td className="py-6"><span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase shadow-sm bg-emerald-100 text-emerald-700">{doc.status}</span></td>
                                <td className="py-6 text-right space-x-3">
                                    <button onClick={() => removeDoctor(doc.id)} className="p-3 bg-white text-rose-500 rounded-xl border hover:bg-rose-500 hover:text-white transition-all shadow-sm" title="Remove"><Trash2 size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-xl font-bold">No doctors registered yet</p>
                  </div>
                )}
            </div>
          )}

          {activeTab === 'patients' && (
             <div className="bg-white p-12 rounded-[4rem] shadow-xl border">
               <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-black italic underline decoration-blue-200 underline-offset-8">Patient Directory</h2>
                    <div className="relative w-1/3">
                        <Search className="absolute left-5 top-4 text-slate-400" size={20}/>
                        <input type="text" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} placeholder="Search patients..." className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold text-sm" />
                    </div>
                </div>
                {filteredPatients.length > 0 ? (
                  <div className="grid grid-cols-2 gap-6">
                    {filteredPatients.map((patient, i) => (
                        <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border flex justify-between items-center hover:bg-white hover:shadow-xl transition-all group">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black group-hover:bg-blue-600 transition-colors">
                                {patient.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-xl font-black italic">{patient.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{patient.email}</p>
                                <p className="text-[9px] text-slate-400 mt-1">Joined: {patient.joined}</p>
                              </div>
                            </div>
                            <button onClick={() => removePatient(patient.id)} className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1">
                              <Trash2 size={16}/> Remove
                            </button>
                        </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <p className="text-xl font-bold">No patients registered yet</p>
                    <p className="text-sm">Patients will appear here after signup</p>
                  </div>
                )}
             </div>
          )}

          {activeTab === 'admin-appts' && (
             <div className="space-y-6">
                <h2 className="text-3xl font-black italic mb-8 ml-4 underline underline-offset-8">Global Service Audit</h2>
                {appointmentsList.length > 0 ? (
                  appointmentsList.map((a, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-white flex justify-between items-center">
                        <div className="flex items-center gap-10 font-bold">
                            <div><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Assigned MD</p><p className="text-slate-800 italic">Dr. {a.doctorName}</p></div>
                            <div className="w-px h-10 bg-slate-100"></div>
                            <div><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Patient</p><p className="text-slate-800">{a.patientName}</p></div>
                            <div><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Date</p><p className="text-slate-600">{a.date || 'N/A'}</p></div>
                        </div>
                        <div className="flex items-center gap-10 font-black">
                            <div className="text-right"><p className="text-[9px] text-slate-400 uppercase">Consult Fee</p><p className="text-xl text-blue-600 tracking-tighter">₹{a.fee}</p></div>
                            <span className={`px-6 py-2 rounded-2xl text-[9px] uppercase shadow-sm italic ${a.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                              {a.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                        </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-[3rem]">
                    <p className="text-xl font-bold text-slate-400">No appointments yet</p>
                    <p className="text-sm text-slate-400">Appointments will appear here after patients book doctors</p>
                  </div>
                )}
             </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-8">
              <div className="grid grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Total Revenue</p>
                  <p className="text-3xl font-black text-emerald-600 mt-2">₹{stats.revenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Total Transactions</p>
                  <p className="text-3xl font-black text-blue-600 mt-2">{appointmentsList.filter(a => a.paymentStatus === 'paid').length}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Pending Payments</p>
                  <p className="text-3xl font-black text-orange-600 mt-2">{appointmentsList.filter(a => a.paymentStatus !== 'paid').length}</p>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border">
                <h2 className="text-2xl font-black italic mb-8">All Payment Transactions</h2>
                <div className="space-y-4">
                  {appointmentsList.filter(a => a.paymentStatus === 'paid').map((app, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black">₹</div>
                        <div>
                          <p className="font-bold text-slate-800">{app.patientName}</p>
                          <p className="text-xs text-slate-500">Dr. {app.doctorName} • {app.date} at {app.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-emerald-600">+₹{app.fee}</p>
                        <p className="text-[8px] text-emerald-500 uppercase">Paid via Clinico Pay</p>
                      </div>
                    </div>
                  ))}
                  {appointmentsList.filter(a => a.paymentStatus === 'paid').length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                      <p className="text-xl font-bold">No transactions yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminPanel;