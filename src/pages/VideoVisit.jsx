import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Send, User, Loader2, Camera, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const VideoVisit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [messages, setMessages] = useState([{ sender: 'System', text: 'Secure Line Established. Waiting for Doctor to start...' }]);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const videoRef = useRef(null);
  const hasGreeted = useRef(false);

  const myRole = user?.role || 'Patient';
  const myName = user?.firstName || user?.name || 'Guest';
  
  const patientData = {
    name: 'Rahul Sharma',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces'
  };
  
  const otherName = myRole === 'Doctor' ? `${patientData.name} (Patient)` : 'Dr. Sarah Smith';
  const otherImage = myRole === 'Doctor' ? patientData.image : null;

  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  };

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setPermissionGranted(true);
      toast.success("Camera & Microphone permissions granted!");
      
      if (!hasGreeted.current) {
        setTimeout(() => {
          const greeting = `Hello ${myRole === 'Doctor' ? 'Rahul' : myName}, I am Dr. Sarah. How are you feeling today?`;
          setMessages(prev => [...prev, { sender: 'Dr. Sarah', text: greeting }]);
          speakText(greeting);
          setIsWaiting(true);
        }, 3000);
        hasGreeted.current = true;
      }
    } catch (err) {
      console.error("Permission error:", err);
      setPermissionDenied(true);
      toast.error("Camera/Microphone permission denied. Please allow access in browser settings.");
    }
  };

  useEffect(() => {
    requestPermissions();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleResponse = () => {
    if(!input) return;
    const patientMsg = input;
    setMessages(prev => [...prev, { sender: myName, text: patientMsg }]);
    setInput("");
    setIsWaiting(false);

    setTimeout(() => {
      let docReply = "I understand. Based on what you said, I recommend complete rest and Paracetamol 500mg. Please stay hydrated.";
      
      const lowInput = patientMsg.toLowerCase();
      if(lowInput.includes("stomach")) docReply = "I see. Please take an Antacid and avoid oily food for 2 days. Drink plenty of water.";
      if(lowInput.includes("headache")) docReply = "That sounds like stress or migraine. Take a Saridon and rest in a dark room.";

      setMessages(prev => [...prev, { sender: 'Dr. Sarah', text: docReply }]);
      speakText(docReply);
    }, 3000);
  };

  const toggleMute = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const audioTracks = videoRef.current.srcObject.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks.forEach(track => {
          track.enabled = isMuted;
        });
      }
    }
    setIsMuted(!isMuted);
    toast.success(isMuted ? "Microphone unmuted" : "Microphone muted");
  };

  const toggleVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const videoTracks = videoRef.current.srcObject.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks.forEach(track => {
          track.enabled = isVideoOff;
        });
      }
    }
    setIsVideoOff(!isVideoOff);
    toast.success(isVideoOff ? "Camera turned on" : "Camera turned off");
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col md:flex-row overflow-hidden font-sans">
      <Toaster position="top-center" />

      <div className="w-full md:w-1/4 bg-slate-900 border-r border-white/10 p-6 flex flex-col items-center justify-center relative">
        <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-slate-800 border-2 border-white/5 relative flex items-center justify-center shadow-2xl">
          {permissionDenied ? (
            <div className="text-center p-6">
              <AlertCircle size={60} className="text-red-500 mx-auto mb-4" />
              <p className="text-red-400 font-bold text-lg mb-2">Permissions Required</p>
              <p className="text-slate-500 text-sm mb-4">Please allow camera and microphone access</p>
              <button 
                onClick={requestPermissions}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
              >
                Grant Permissions
              </button>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : 'block'}`} 
              />
              {(isVideoOff || !permissionGranted) && (
                <div className="text-center p-6">
                  <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/10">
                      <Camera size={40} className="text-white/20"/>
                  </div>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest leading-relaxed">
                     {permissionGranted ? 'Video Paused' : 'Requesting Camera Access...'}
                  </p>
                </div>
              )}
            </>
          )}
          <div className="absolute top-6 left-6 bg-blue-600/80 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[9px] font-black text-white uppercase tracking-[0.2em] border border-white/10">LIVE: {myName} ({myRole})</div>
          {isMuted && (
            <div className="absolute top-6 right-6 bg-red-500/80 backdrop-blur-md px-3 py-1 rounded-xl text-[9px] font-black text-white uppercase tracking-[0.2em]">MUTED</div>
          )}
        </div>
      </div>

      <div className="flex-1 relative flex items-center justify-center bg-slate-800 p-10">
        <div className="text-center">
            <div className="w-56 h-56 rounded-full mx-auto flex items-center justify-center border-8 border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.3)] mb-8 overflow-hidden relative group">
                {otherImage ? (
                  <img src={otherImage} alt="Patient" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <User size={100} className="text-white/10 group-hover:scale-110 transition-transform duration-700"/>
                    <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                  </>
                )}
            </div>
            <h2 className="text-white font-black text-3xl italic tracking-tighter">{otherName}</h2>
            <div className="flex items-center justify-center gap-3 mt-4">
                {isWaiting ? (
                    <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                        <p className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">Doctor is listening...</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                        <Loader2 className="text-blue-400 animate-spin" size={14}/>
                        <p className="text-blue-400 font-black text-[10px] uppercase tracking-widest">Processing Dialogue...</p>
                    </div>
                )}
            </div>
        </div>

        <div className="absolute bottom-12 flex gap-8 bg-slate-900/40 backdrop-blur-3xl p-8 rounded-[3.5rem] border border-white/10 shadow-2xl">
            <button 
              onClick={toggleMute} 
              className={`p-6 rounded-full transition-all hover:scale-110 ${isMuted ? 'bg-red-500 shadow-red-500/20' : 'bg-white/5 text-white hover:bg-white/10'}`}
              title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
            >
                {isMuted ? <MicOff/> : <Mic/>}
            </button>
            <button 
              onClick={toggleVideo} 
              className={`p-6 rounded-full transition-all hover:scale-110 ${isVideoOff ? 'bg-red-500 shadow-red-500/20' : 'bg-white/5 text-white hover:bg-white/10'}`}
              title={isVideoOff ? "Turn On Camera" : "Turn Off Camera"}
            >
                {isVideoOff ? <VideoOff/> : <Video/>}
            </button>
            <button 
              onClick={() => navigate(user?.role === 'Doctor' ? '/doctor-dashboard' : '/patient-dashboard')} 
              className="p-6 bg-red-600 rounded-full text-white hover:scale-125 transition-all shadow-[0_0_40px_rgba(220,38,38,0.4)]" 
              title="End Visit"
            >
                <PhoneOff/>
            </button>
        </div>
      </div>

      <div className="w-full md:w-[400px] bg-white flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.1)] z-20">
        <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
            <div>
                <h3 className="font-black text-slate-800 text-lg flex items-center gap-2 italic">Clinical Transcript</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Session ID: 882-991-X</p>
            </div>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest">SECURE</span>
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-white">
            {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.sender.includes('Sarah') ? 'items-start' : 'items-end'}`}>
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-2 tracking-widest">{m.sender}</p>
                    <div className={`p-5 rounded-[2rem] text-sm font-bold leading-relaxed shadow-sm border ${
                        m.sender.includes('Sarah') 
                        ? 'bg-blue-50 text-blue-900 border-blue-100 rounded-tl-none' 
                        : 'bg-slate-900 text-white border-transparent rounded-tr-none'
                    }`}>
                        {m.text}
                    </div>
                </div>
            ))}
        </div>

        <div className="p-6 border-t bg-slate-50/50 flex flex-col gap-4">
            <div className="flex gap-3">
                <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleResponse()}
                    placeholder={isWaiting ? "Reply to the doctor..." : "Doctor is speaking..."}
                    disabled={!isWaiting}
                    className="flex-1 p-5 bg-white border-2 border-slate-100 rounded-[2rem] outline-none font-bold text-sm focus:border-blue-600 transition-all shadow-inner disabled:opacity-50" 
                />
                <button 
                    onClick={handleResponse}
                    disabled={!isWaiting}
                    className="p-5 bg-blue-600 text-white rounded-[1.8rem] hover:bg-slate-900 transition-all shadow-xl disabled:bg-slate-300"
                >
                    <Send size={22}/>
                </button>
            </div>
            <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Conversation is being recorded for medical history</p>
        </div>
      </div>
    </div>
  );
};

export default VideoVisit;