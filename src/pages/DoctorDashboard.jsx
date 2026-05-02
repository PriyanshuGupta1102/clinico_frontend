import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { X, Edit3, Phone, ShieldCheck, Eye, User, Star, Award, Users, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [bgImage, setBgImage] = useState("");
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  
  const sampleMedicalRecords = [
    { id: 1, patientName: 'Rahul Sharma', recordName: 'Blood Test Report', date: '2024-04-15', doctorName: 'Dr. Smith', description: 'Complete Blood Count - All parameters normal', status: 'Normal' },
    { id: 2, patientName: 'Priya Patel', recordName: 'X-Ray Chest', date: '2024-04-12', doctorName: 'Dr. Smith', description: 'No abnormal findings in chest X-ray', status: 'Clear' },
    { id: 3, patientName: 'Amit Kumar', recordName: 'MRI Brain Scan', date: '2024-04-10', doctorName: 'Dr. Smith', description: 'Minor sinus inflammation detected', status: 'Follow-up' },
    { id: 4, patientName: 'Sneha Gupta', recordName: 'ECG Report', date: '2024-04-08', doctorName: 'Dr. Smith', description: 'Normal sinus rhythm, heart function normal', status: 'Normal' },
    { id: 5, patientName: 'Vikram Singh', recordName: 'Liver Function Test', date: '2024-04-05', doctorName: 'Dr. Smith', description: 'Slightly elevated enzymes, advised diet change', status: 'Attention' },
  ];

  const [doctorData, setDoctorData] = useState({
    name: user?.name || user?.firstName || '',
    firstName: user?.firstName || user?.name?.split(' ')[0] || '',
    lastName: user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    specialization: user?.specialization || '',
    experience: user?.experience || 0,
    consultationFee: user?.consultationFee || user?.fees || 0,
    gender: user?.gender || '',
    profileImage: user?.profileImage || ''
  });

  const [settings, setSettings] = useState({ emailAlerts: true, acceptingOnline: true });

  useEffect(() => {
    setBgImage("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop");
    if (user) {
      setDoctorData({
        name: user.name || user.firstName || '',
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        specialization: user.specialization || '',
        experience: user.experience || 0,
        consultationFee: user.consultationFee || user.fees || 0,
        gender: user.gender || '',
        profileImage: user.profileImage || ''
      });
      setProfileImage(user.profileImage || '');
      fetchDoctorData();
    }
  }, [user]);

  const fetchDoctorData = async () => {
    try {
      if (user?.id) {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/appointments/${user.id}/doctor`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setAppointmentsList(res.data.appointments || []);
          const uniquePatients = [];
          const patientMap = new Map();
          res.data.appointments.forEach(app => {
            if (!patientMap.has(app.patientId)) {
              patientMap.set(app.patientId, true);
              uniquePatients.push({
                id: app.patientId,
                name: app.patientName,
                lastVisit: app.date,
                condition: app.doctorSpecialization
              });
            }
          });
          setPatientsList(uniquePatients);
        }
      }
    } catch (err) {
      console.log("Using default data");
    }
  };

  const handleSaveDetails = () => {
    const updatedUser = {
      ...user,
      name: doctorData.firstName + ' ' + doctorData.lastName,
      firstName: doctorData.firstName,
      lastName: doctorData.lastName,
      specialization: doctorData.specialization,
      experience: doctorData.experience,
      consultationFee: doctorData.consultationFee,
      gender: doctorData.gender,
      profileImage: profileImage
    };
    setUser(updatedUser);
    localStorage.setItem('clinicoUser', JSON.stringify(updatedUser));
    toast.success("Profile Synced Successfully!");
    setShowEditModal(false);
  };

  const handleImageUpload = async (e, isProfile = false) => {
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
        if (isProfile) {
          setProfileImage(reader.result);
        }
        toast.success('Image uploaded successfully!');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error('Failed to upload image');
      setUploadingImage(false);
    }
  };

  const startVideoVisit = () => {
    navigate('/doctor-video-visit');
  };

  const doctorImg = profileImage || (doctorData.gender === 'Male' || doctorData.gender === 'Female' 
    ? (doctorData.gender === 'Male' ? "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200" : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200")
    : "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200");

  const handleDoctorDataChange = (field, value) => {
    setDoctorData({ ...doctorData, [field]: value });
  };

  return (
    <div className="flex bg-slate-50 min-h-screen relative overflow-hidden font-sans">
      <Toaster position="top-right" />
      
      <div className="fixed inset-0 z-0">
        <img src={bgImage} className="w-full h-full object-cover opacity-5" alt="bg" />
        <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-[2px]"></div>
      </div>

      <Sidebar role="Doctor" activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-72 p-12 w-full relative z-10">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Welcome, Dr. {doctorData.firstName || doctorData.name}</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest bg-blue-50 px-3 py-1 rounded-full inline-block mt-2 border border-blue-100 italic">Professional Clinico Account</p>
          </div>
          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md p-3 rounded-3xl shadow-sm border border-white pr-8">
            <img src={doctorImg} alt="dr" className="w-14 h-14 rounded-2xl object-cover ring-4 ring-blue-50 shadow-md" />
            <div>
                <p className="font-black text-slate-800 leading-tight">Dr. {doctorData.firstName || doctorData.name}</p>
                <p className="text-[10px] text-blue-600 font-black uppercase tracking-tighter">{doctorData.specialization || 'Specialist'}</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'details' && (
            <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <img src={doctorImg} className="w-40 h-40 rounded-[2.5rem] object-cover shadow-2xl ring-4 ring-blue-50" alt="profile" />
                  <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-xl cursor-pointer hover:bg-slate-900 transition">
                    <Upload size={16} />
                    <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={(e) => handleImageUpload(e, true)} className="hidden" />
                  </label>
                </div>
                <h2 className="text-2xl font-black text-slate-800 italic">Dr. {doctorData.firstName} {doctorData.lastName}</h2>
                <span className="bg-blue-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black mt-3 uppercase tracking-widest shadow-lg shadow-blue-200">{doctorData.specialization || 'Senior Consultant'}</span>
                
                <div className="w-full mt-10 space-y-5 text-left border-t border-slate-50 pt-8">
                    <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Consultation Fee</p><p className="text-2xl font-black text-blue-600 tracking-tighter">₹{doctorData.consultationFee || 0}</p></div>
                    <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Gender</p><p className="font-bold text-slate-700 uppercase text-sm tracking-tight">{doctorData.gender || 'Not set'}</p></div>
                    <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Experience</p><p className="font-bold text-slate-700">{doctorData.experience || 0} Years</p></div>
                </div>
                <button onClick={() => setShowEditModal(true)} className="mt-10 flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-blue-600 transition shadow-2xl active:scale-95 italic">
                   <Edit3 size={20}/> Edit Details
                </button>
              </div>

              <div className="md:col-span-2 space-y-8">
                <div className="grid grid-cols-3 gap-6 font-bold">
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group hover:scale-105 transition-transform">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Award size={60}/></div>
                        <p className="opacity-50 text-[9px] font-black uppercase tracking-widest italic">Experience</p>
                        <p className="text-3xl font-black text-blue-400 mt-1">{doctorData.experience || 0} Years</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-white shadow-xl group hover:scale-105 transition-transform">
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest italic">Global Rating</p>
                        <p className="text-3xl font-black text-emerald-500 mt-1 flex items-center gap-2">4.9 <Star size={24} fill="currentColor" className="text-orange-400 border-none"/></p>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-white shadow-xl group hover:scale-105 transition-transform">
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest italic">Patients</p>
                        <p className="text-3xl font-black text-indigo-600 mt-1 flex items-center gap-2">{patientsList.length} <Users size={24}/></p>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-white">
                    <h3 className="text-xl font-black text-slate-800 mb-8 border-b pb-4 italic flex items-center gap-2 tracking-tight">
                        Official Contact & Specialization
                    </h3>
                    <div className="grid grid-cols-2 gap-10">
                        <div><label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">Login Email ID</label><p className="font-bold text-slate-700 italic">{doctorData.email}</p></div>
                        <div><label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">Assigned Speciality</label><p className="font-bold text-blue-600 uppercase text-sm tracking-tighter">{doctorData.specialization || 'General Medicine'}</p></div>
                        <div><label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">Consultation Fee</label><p className="font-bold text-emerald-600">₹{doctorData.consultationFee || 0}</p></div>
                    </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 font-bold">
              {appointmentsList.length > 0 ? (
                appointmentsList.map((app, i) => (
                  <div key={i} className="flex items-center justify-between p-8 bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center font-black">APT</div>
                      <div>
                        <p className="text-xl font-black text-slate-800 italic">{app.patientName}</p>
                        <p className="text-xs text-slate-400 font-bold tracking-widest mt-1 uppercase">Appointment Date: {app.date || 'N/A'} • Time: {app.time || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${app.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'}`}>
                        {app.status || 'Confirmed'}
                      </span>
                      <button onClick={startVideoVisit} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-slate-900 transition flex items-center gap-2 italic tracking-tighter">Start Interaction <Phone size={16}/></button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white/80 rounded-[3rem]">
                  <p className="text-xl font-bold text-slate-400">No appointments yet</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'records' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/80 p-10 rounded-[3.5rem] border border-white shadow-xl">
                <h2 className="text-2xl font-black mb-10 italic underline underline-offset-8 decoration-blue-200">Patient Medical Records</h2>
                <div className="space-y-4">
                  {(patientsList.length > 0 ? patientsList : [{ id: 1, name: 'Sample Patient', lastVisit: 'N/A' }]).map((patient, idx) => (
                      <div key={idx} className="flex justify-between items-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl transition-all cursor-pointer group">
                          <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 font-black shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                {patient.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-black text-slate-800 text-lg tracking-tighter">{patient.name}</p>
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest">Last Visit: {patient.lastVisit}</p>
                              </div>
                          </div>
                          <button onClick={() => setSelectedPatient(patient)} className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:underline">
                            <Eye size={18}/> View Medical History
                          </button>
                      </div>
                  ))}
                </div>

                <div className="mt-12">
                  <h3 className="text-xl font-black mb-6 italic">Recent Medical Reports</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {sampleMedicalRecords.map((record, i) => (
                      <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-black text-slate-800">{record.patientName}</p>
                            <p className="text-xs text-slate-400">{record.date}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase ${record.status === 'Normal' || record.status === 'Clear' ? 'bg-emerald-100 text-emerald-600' : record.status === 'Attention' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                            {record.status}
                          </span>
                        </div>
                        <p className="font-bold text-slate-700">{record.recordName}</p>
                        <p className="text-xs text-slate-500 mt-2">{record.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
             </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 font-bold">
                <div className="bg-white/80 p-12 rounded-[3.5rem] border border-white shadow-xl text-center">
                    <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-inner overflow-hidden">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <User size={40}/>
                      )}
                    </div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">{doctorData.firstName} {doctorData.lastName}</h3>
                    <p className="text-slate-400 italic mb-8">{doctorData.email}</p>
                    <button onClick={() => setShowEditModal(true)} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black hover:bg-blue-600 transition shadow-xl flex items-center justify-center gap-2 tracking-tighter italic">
                        <Edit3 size={18}/> Update Account Details
                    </button>
                </div>
                <div className="bg-white/80 p-12 rounded-[3.5rem] border border-white shadow-xl space-y-8">
                    <h3 className="text-2xl font-black italic flex items-center gap-3 tracking-tighter"><ShieldCheck className="text-indigo-600"/> Portal Security</h3>
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl font-black text-slate-700 shadow-sm border border-slate-100">
                        <span>Email Alerts</span> 
                        <button onClick={() => setSettings({...settings, emailAlerts: !settings.emailAlerts})} className={`w-14 h-7 rounded-full p-1 transition-all ${settings.emailAlerts ? 'bg-blue-600' : 'bg-slate-300'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full transition-all ${settings.emailAlerts ? 'translate-x-7' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                    <button className="w-full p-6 bg-slate-900 text-white rounded-[2rem] font-black hover:bg-blue-600 transition italic tracking-tighter shadow-lg">Change Security Password</button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showEditModal && (
            <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 font-bold">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white w-full max-w-2xl rounded-[3.5rem] p-12 relative shadow-2xl">
                    <button onClick={() => setShowEditModal(false)} className="absolute top-10 right-10 text-slate-400 hover:text-red-500 transition-colors"><X size={24}/></button>
                    <h2 className="text-3xl font-black mb-10 text-slate-800 italic tracking-tighter">Edit Clinical Profile</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest italic">First Name</label>
                          <input type="text" value={doctorData.firstName || ''} onChange={(e) => handleDoctorDataChange('firstName', e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-black shadow-inner" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest italic">Last Name</label>
                          <input type="text" value={doctorData.lastName || ''} onChange={(e) => handleDoctorDataChange('lastName', e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-black shadow-inner" />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest italic">Professional Email Address</label>
                          <input type="email" value={user?.email || ''} disabled className="w-full p-5 bg-slate-100 rounded-2xl outline-none font-black shadow-inner text-slate-400" />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest italic">Specialization</label>
                          <input type="text" value={doctorData.specialization || ''} onChange={(e) => handleDoctorDataChange('specialization', e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-black shadow-inner" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest italic">Years of Experience</label>
                          <input type="number" value={doctorData.experience || 0} onChange={(e) => handleDoctorDataChange('experience', e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-black shadow-inner" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest italic">Consultation Fee (INR)</label>
                          <input type="number" value={doctorData.consultationFee || 0} onChange={(e) => handleDoctorDataChange('consultationFee', e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-black shadow-inner" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest italic">Gender</label>
                          <select value={doctorData.gender || ''} onChange={(e) => handleDoctorDataChange('gender', e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl outline-none font-black shadow-inner">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest italic">Profile Picture</label>
                          <div className="flex items-center gap-4">
                            {profileImage && (
                              <img src={profileImage} alt="Preview" className="w-12 h-12 rounded-xl object-cover" />
                            )}
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl hover:bg-slate-100">
                              <Upload size={16} />
                              <span className="text-sm font-bold">Upload</span>
                              <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={(e) => handleImageUpload(e, true)} className="hidden" />
                            </label>
                          </div>
                        </div>
                        <button onClick={handleSaveDetails} className="col-span-2 bg-slate-900 text-white py-6 rounded-[2rem] font-black text-lg shadow-xl mt-6 hover:bg-blue-600 transition italic tracking-tighter">Update Clinical Identity</button>
                    </div>
                </motion.div>
            </div>
        )}

        {selectedPatient && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
                <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-white w-full max-w-2xl rounded-[3.5rem] overflow-hidden shadow-2xl">
                    <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                        <div>
                          <h2 className="text-2xl font-black italic tracking-tighter">{selectedPatient.name}</h2>
                          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Full Clinical History • Patient ID: {selectedPatient.id}</p>
                        </div>
                        <button onClick={() => setSelectedPatient(null)} className="p-3 bg-white/10 rounded-2xl hover:bg-red-500 transition-colors"><X/></button>
                    </div>
                    <div className="p-12 space-y-8 font-bold">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest italic">Current Condition</p>
                              <p className="text-slate-800">{selectedPatient.condition}</p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                              <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest italic">Last Visit</p>
                              <p className="text-slate-800">{selectedPatient.lastVisit}</p>
                            </div>
                        </div>
                        <div className="bg-blue-50/50 p-8 rounded-[2.5rem] border-2 border-blue-100 shadow-inner">
                            <p className="text-blue-600 text-[10px] font-black uppercase mb-4 tracking-widest underline underline-offset-8">No medical records uploaded yet</p>
                        </div>
                    </div>
                    <div className="p-8 text-center bg-slate-50 border-t">
                      <button onClick={() => setSelectedPatient(null)} className="bg-slate-900 text-white px-12 py-4 rounded-[2rem] font-black tracking-tighter shadow-xl hover:bg-red-600 transition-colors">Exit Patient Record</button>
                    </div>
                </motion.div>
            </div>
        )}
      </main>
    </div>
  );
};
export default DoctorDashboard;