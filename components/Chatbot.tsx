
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Icons, COLORS } from '../constants';
import { getGeminiChatResponse } from '../services/geminiService';

const N8N_WEBHOOK_URL = 'https://abdulmathin.app.n8n.cloud/webhook-test/19cdaba3-dffa-419d-9bdb-ddf271df0738';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [leadInfo, setLeadInfo] = useState<{ email: string; phone: string } | null>(null);
  const [leadForm, setLeadForm] = useState({ email: '', phone: '' });
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I'm your MapleLeaf AI expert. How can I help you with Canadian rentals today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, leadInfo]);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (leadForm.email && leadForm.phone) {
      setLeadInfo(leadForm);
      
      // Optional: Send lead info to n8n immediately when they start a chat
      try {
        fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'chatbot_lead_captured',
            email: leadForm.email,
            phone: leadForm.phone,
            timestamp: new Date().toISOString()
          }),
        });
      } catch (err) {
        console.error("Failed to sync chatbot lead", err);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !leadInfo) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const aiResponse = await getGeminiChatResponse(history, input);

    const botMessage: ChatMessage = {
      role: 'model',
      text: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300">
          {/* Header */}
          <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold">M</div>
              <div>
                <p className="font-bold text-sm">Rental Expert AI</p>
                <p className="text-[10px] text-slate-400">Personalized Assistance</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
              <Icons.Close />
            </button>
          </div>

          {!leadInfo ? (
            /* Lead Capture Form Gate */
            <div className="flex-1 flex flex-col p-8 justify-center bg-slate-50">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icons.Chat />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900">Let's get started</h3>
                <p className="text-sm text-slate-500 mt-2">Enter your details to unlock the AI rental assistant.</p>
              </div>
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@email.ca"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none text-sm transition-all"
                    value={leadForm.email}
                    onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (___) ___-____"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none text-sm transition-all"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg active:scale-[0.98] mt-4"
                >
                  Start Chatting
                </button>
                <p className="text-[10px] text-center text-slate-400 px-4 mt-4">
                  By starting, you agree to receive automated rental updates via email/SMS.
                </p>
              </form>
            </div>
          ) : (
            /* Chat Interface (Unlocked) */
            <>
              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.role === 'user' 
                      ? 'bg-red-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1">
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask about rent control, markets..."
                    className="flex-1 text-sm bg-slate-50 border-none focus:ring-2 focus:ring-red-500 rounded-xl px-4 py-2 outline-none transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={isLoading}
                    className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center hover:bg-red-700 transition-all disabled:opacity-50 shadow-md active:scale-90"
                  >
                    <Icons.Send />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-red-700 hover:scale-110 transition-all duration-300 active:scale-90 group"
      >
        {isOpen ? <Icons.Close /> : <div className="group-hover:animate-pulse"><Icons.Chat /></div>}
      </button>
    </div>
  );
};

export default Chatbot;
