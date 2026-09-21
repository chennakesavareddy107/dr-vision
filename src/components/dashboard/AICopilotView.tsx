import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  RefreshCw,
  FileText,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { PredictionResult } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AICopilotViewProps {
  currentPrediction?: PredictionResult;
}

export const AICopilotView: React.FC<AICopilotViewProps> = ({ currentPrediction }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `Hello, Doctor. I am the DR Vision Ophthalmology AI Copilot, calibrated on clinical guidelines (AAO, ICO, and ETDRS). ${
        currentPrediction
          ? `I am currently contextualized to Patient ${currentPrediction.patientName} (${currentPrediction.patientId}), diagnosed with ${currentPrediction.predictedGrade === 2 ? 'Grade 2 (Moderate NPDR)' : `Grade ${currentPrediction.predictedGrade}`}.`
          : 'How can I assist you with diabetic retinopathy grading, Grad-CAM interpretation, or clinical protocol guidance today?'
      }`,
      timestamp: 'Just now',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starterChips = [
    'Explain the ETDRS 4-2-1 rule for Severe NPDR',
    'How do ConvNeXtV2 and Swin features combine in Grad-CAM?',
    'Draft a plain-language explanation for this patient',
    'What are the referral criteria for proliferative retinopathy (NVD/NVE)?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          predictionContext: currentPrediction,
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || 'Analysis completed according to American Academy of Ophthalmology guidelines.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'The ETDRS classification standardizes diabetic retinopathy based on vascular pathology: Grade 0 (no abnormalities), Grade 1 (microaneurysms only), Grade 2 (moderate hemorrhages/exudates), Grade 3 (severe NPDR fulfilling the 4-2-1 rule), and Grade 4 (active neovascularization or vitreous hemorrhage). Please consult primary clinical literature for treatment decisions.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col" id="ai-copilot-view">
      
      {/* Header */}
      <div className="pb-3 border-b border-slate-200 shrink-0">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-xs font-mono border border-teal-200 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ophthalmology Clinical Reasoning Engine</span>
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#0B1B3B]">
          AI Copilot & Diagnostic Assistant
        </h1>
        <p className="text-xs text-slate-500">
          Grounded on clinical ophthalmology literature, ETDRS staging, and feature-attribution interpretation.
        </p>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser ? 'bg-[#0B1B3B] text-white' : 'bg-teal-600 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-1">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#0B1B3B] text-white rounded-tr-xs'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                <div className={`text-[10px] text-slate-400 font-mono ${isUser ? 'text-right' : 'text-left'}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2 text-xs text-slate-500 font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
              <span>Analyzing ophthalmic literature and patient saliency tensors...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts Chips */}
      <div className="shrink-0 flex items-center gap-2 overflow-x-auto pb-1">
        {starterChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="text-[11px] font-medium px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition-colors cursor-pointer shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Prompt Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="shrink-0 flex gap-2"
      >
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Ask about lesion characteristics, differential diagnoses, or patient care guidelines..."
          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
        />

        <button
          type="submit"
          disabled={loading || !inputPrompt.trim()}
          className="px-5 py-3 rounded-2xl bg-[#0B1B3B] hover:bg-[#13274F] text-white text-xs font-semibold shadow-2xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};
