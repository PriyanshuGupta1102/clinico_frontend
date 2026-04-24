import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Send, User, MessageSquare, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const DoctorVideoVisit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'System', text: 'Secure line established. Please initiate the consultation.' }]);
  const [input, setInput] = useState("");
  const [canDoctorSpeak, setCanDoctorSpeak] = useState(true);
  const [interactionStep, setInteractionStep] = useState(0); // 👈 Tracks conversation flow
  const videoRef = useRef(null);

  const myName = "Dr. " + (user?.firstName || 'Professional');
  const patientName = "Rahul Sharma (Patient)";

  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    async function startMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) { console.log("Camera Hardware Not Found."); }
    }
    startMedia();
  }, []);

  // 👈 Smart Interaction Logic
  const handleDoctorAction = () => {
    if(!input) return;
    const docMsg = input.toLowerCase();
    setMessages(prev => [...prev, { sender: myName, text: input }]);
    setInput("");
    setCanDoctorSpeak(false);

    setTimeout(() => {
      let patientReply = "";

      // Logic based on Doctor's Keywords
      if (docMsg.includes("hello") || docMsg.includes("hi") || docMsg.includes("how are you")) {
        patientReply = "Hello Doctor, I'm not feeling very well. I have a sharp pain in my stomach since last night.";
      } 
      else if (docMsg.includes("pain") || docMsg.includes("where") || docMsg.includes("hurt")) {
        patientReply = "The pain is mostly in the lower abdomen, and it gets worse when I try to walk or sit up straight.";
      }
      else if (docMsg.includes("medicine") || docMsg.includes("take") || docMsg.includes("syrup") || docMsg.includes("tablet")) {
        patientReply = "I haven't taken any medicine yet, I was waiting to consult you first. Should I take something right now?";
      }
      else if (docMsg.includes("fever") || docMsg.includes("temperature") || docMsg.includes("cold")) {
        patientReply = "Yes, I checked an hour ago, it was around 101 degrees. I also feel a bit shivery.";
      }
      else if (docMsg.includes("rest") || docMsg.includes("sleep") || docMsg.includes("water") || docMsg.includes("diet")) {
        patientReply = "Okay Doctor, I will take complete rest and follow your advice on the diet. Anything else I should keep in mind?";
      }
      else if (docMsg.includes("test") || docMsg.includes("blood") || docMsg.includes("report") || docMsg.includes("scan")) {
        patientReply = "Sure, I can go for the tests today evening. Where should I send the reports once I get them?";
      }
      else if (docMsg.includes("bye") || docMsg.includes("ok") || docMsg.includes("take care") || docMsg.includes("done")) {
        patientReply = "Thank you so much, Doctor. I feel much better talking to you. Have a great day!";
      }
      else {
        // Default Varied Response to avoid repetition
        const randomResponses = [
          "I understand, Doctor. Could you please explain more about the cure?",
          "Yes, I will definitely follow that. Is there any side effect of the medicine?",
          "Okay, I'm making a note of this. Thank you for the guidance."
        ];
        patientReply = randomResponses[interactionStep % 3];
      }

      setMessages(prev => [...prev, { sender: 'Rahul Sharma', text: patientReply }]);
      speakText(patientReply);
      setCanDoctorSpeak(true);
      setInteractionStep(prev => prev + 1); // Move to next step of logic
    }, 3000);
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden font-sans">
      <Toaster position="top-right" />

      {/* LEFT: DOCTOR'S LIVE CAMERA */}
      <div className="w-full md:w-1/4 bg-slate-900 border-r border-white/10 p-6 flex flex-col items-center justify-center relative">
        <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-slate-800 border-2 border-white/5 relative flex items-center justify-center shadow-2xl">
          <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`} />
          {(!videoRef.current?.srcObject || isVideoOff) && (
             <div className="text-center"><User size={40} className="text-white/20 mx-auto"/><p className="text-[9px] text-slate-500 font-black mt-2 uppercase tracking-widest italic">Live Feed Active</p></div>
          )}
          <div className="absolute top-6 left-6 bg-blue-600/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[9px] font-black text-white uppercase tracking-widest border border-white/10">LIVE: {myName}</div>
        </div>
      </div>

      {/* CENTER: PATIENT PLACEHOLDER */}
      <div className="flex-1 relative flex items-center justify-center bg-slate-800 p-10">
        <div className="text-center">
            <div className="w-56 h-56 bg-slate-700 rounded-full mx-auto flex items-center justify-center border-8 border-white/5 shadow-2xl mb-8 relative">
                <User size={100} className="text-white/10"/>
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse rounded-full"></div>
            </div>
            <h2 className="text-white font-black text-3xl italic tracking-tighter">{patientName}</h2>
            <div className="flex items-center justify-center gap-3 mt-4">
                {!canDoctorSpeak ? (
                    <div className="bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 flex items-center gap-2">
                        <Loader2 className="text-blue-400 animate-spin" size={14}/>
                        <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.2em]">Patient is analyzing & replying...</p>
                    </div>
                ) : (
                    <div className="bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                        <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em]">Patient is listening to you...</p>
                    </div>
                )}
            </div>
        </div>

        {/* CONTROLS */}
        <div className="absolute bottom-12 flex gap-8 bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[3.5rem] border border-white/10 shadow-2xl">
            <button onClick={() => setIsMuted(!isMuted)} className={`p-6 rounded-full transition-all ${isMuted ? 'bg-red-500' : 'bg-white/5 text-white'}`}><Mic/></button>
            <button onClick={() => setIsVideoOff(!isVideoOff)} className={`p-6 rounded-full transition-all ${isVideoOff ? 'bg-red-500' : 'bg-white/5 text-white'}`}><Video/></button>
            <button onClick={() => navigate('/doctor-dashboard')} className="p-6 bg-red-600 rounded-full text-white hover:scale-110 transition shadow-[0_0_30px_rgba(220,38,38,0.4)]"><PhoneOff/></button>
        </div>
      </div>

      {/* RIGHT: CHAT LOG */}
      <div className="w-full md:w-[400px] bg-white flex flex-col shadow-2xl border-l border-slate-100">
        <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
            <h3 className="font-black text-slate-800 text-lg italic"><MessageSquare className="inline-block mr-2 text-blue-600"/> Session Dialogue</h3>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest shadow-sm">SECURE</span>
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-white font-bold">
            {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.sender.includes('Dr.') ? 'items-start' : 'items-end'}`}>
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">{m.sender}</p>
                    <div className={`p-5 rounded-[2rem] text-sm leading-relaxed border ${
                        m.sender.includes('Dr.') 
                        ? 'bg-blue-50 text-blue-900 border-blue-100 rounded-tl-none shadow-sm' 
                        : 'bg-slate-900 text-white border-transparent rounded-tr-none shadow-xl'
                    }`}>
                        {m.text}
                    </div>
                </div>
            ))}
        </div>

        <div className="p-6 border-t bg-slate-50/50">
            <div className="flex gap-3">
                <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleDoctorAction()}
                    placeholder={canDoctorSpeak ? "Speak/Type your diagnosis..." : "Waiting..."}
                    disabled={!canDoctorSpeak}
                    className="flex-1 p-5 bg-white border-2 border-slate-100 rounded-[2rem] outline-none font-bold text-sm focus:border-blue-600 transition-all shadow-inner" 
                />
                <button 
                    onClick={handleDoctorAction}
                    disabled={!canDoctorSpeak}
                    className="p-5 bg-blue-600 text-white rounded-[1.8rem] hover:bg-slate-900 transition-all shadow-lg disabled:bg-slate-300"
                >
                    <Send size={22}/>
                </button>
            </div>
            <p className="text-center text-[9px] font-black text-slate-400 uppercase mt-4 tracking-widest">Live Clinical Analysis System Active</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorVideoVisit;