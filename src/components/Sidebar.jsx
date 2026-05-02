import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Bot, 
  UserCog,
  FileText,
  Upload,
  TrendingUp
} from 'lucide-react';
import InteractiveLogo from './InteractiveLogo';

const Sidebar = ({ role, activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  
  const menuItems = {
    Patient: [
      { name: 'Dashboard', id: 'dashboard', icon: <LayoutDashboard size={20}/> },
      { name: 'Book Doctor', id: 'booking', icon: <Users size={20}/> },
      { name: 'My Appointments', id: 'appointments', icon: <Calendar size={20}/> },
      { name: 'Medical Records', id: 'records', icon: <FileText size={20}/> },
      { name: 'AI Consult', id: 'ai', icon: <Bot size={20}/> },
      { name: 'Settings', id: 'settings', icon: <Settings size={20}/> },
    ],
    Doctor: [
      { name: 'Personal Details', id: 'details', icon: <UserCog size={20}/> },
      { name: 'My Appointments', id: 'appointments', icon: <Calendar size={20}/> },
      { name: 'Patient Records', id: 'records', icon: <Users size={20}/> },
      { name: 'Settings', id: 'settings', icon: <Settings size={20}/> },
    ],
    Admin: [
  { name: 'Overview', id: 'overview', icon: <LayoutDashboard size={20}/> },
  { name: 'Payments', id: 'payments', icon: <TrendingUp size={20}/> },
  { name: 'Manage Doctors', id: 'doctors', icon: <UserCog size={20}/> },
  { name: 'Manage Patients', id: 'patients', icon: <Users size={20}/> },
  { name: 'Appointments', id: 'admin-appts', icon: <Calendar size={20}/> },
]
  };

  return (
    <div className="w-72 min-h-screen bg-slate-900 text-white p-8 flex flex-col justify-between fixed left-0 top-0 z-40 shadow-2xl">
      <div>
        <div className="flex items-center gap-3 mb-12">
          <InteractiveLogo size={32} />
          <span className="text-2xl font-black tracking-tighter italic">Clinico<span className="text-red-500">.</span></span>
        </div>
        
        <nav className="space-y-2">
          {menuItems[role]?.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold group ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
              
            >
              <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
                {item.icon}
              </span>
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      <button 
        onClick={() => navigate('/signin')} 
        className="flex items-center gap-4 p-4 text-red-400 font-bold hover:bg-red-500/10 rounded-2xl transition-all group"
      >
        <LogOut className="group-hover:-translate-x-1 transition-transform" size={20}/> Log Out
      </button>
    </div>
  );
};

export default Sidebar;