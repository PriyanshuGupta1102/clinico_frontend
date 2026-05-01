import React, { useState } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';

const AIConsult = () => {
  const [symptom, setSymptom] = useState("");
  const [result, setResult] = useState(null);

  const handleConsult = () => {
    // Mock AI Logic (Yahan aap OpenAI API bhi integrate kar sakte hain)
    if(symptom.toLowerCase().includes("fever")) {
      setResult({
        medicine: "Paracetamol 500mg",
        practice: "Keep hydrated and take plenty of rest.",
        warning: "If fever exceeds 103°F, contact a doctor immediately."
      });
    } else {
      setResult({
        medicine: "General Multi-vitamin",
        practice: "Maintain a balanced diet and 8 hours of sleep.",
        warning: "Consult a specialist for detailed diagnosis."
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 flex justify-center items-center gap-3">
            <Sparkles className="text-blue-500" /> AI Medical Consultant
          </h1>
          <p className="text-slate-500">Describe your symptoms, and our AI will suggest initial care.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-50">
          <textarea 
            className="w-full p-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-400 outline-none text-lg"
            rows="4"
            placeholder="E.g. I have been feeling headache and mild fever since yesterday..."
            value={symptom}
            onChange={(e) => setSymptom(e.target.value)}
          />
          <button 
            onClick={handleConsult}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <Bot size={20} /> Analyze Symptoms
          </button>
        </div>

        {result && (
          <div className="mt-10 bg-emerald-50 border border-emerald-100 p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-5 duration-500">
            <h3 className="text-emerald-800 font-bold text-xl mb-4">AI Recommendations:</h3>
            <div className="space-y-4">
              <p><strong>💊 Suggested Medicine:</strong> {result.medicine}</p>
              <p><strong>🧘 Best Practices:</strong> {result.practice}</p>
              <p className="text-red-500 text-sm italic">⚠️ {result.warning}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIConsult;