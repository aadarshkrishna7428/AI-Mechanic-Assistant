import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Wrench,
  Car,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';

export const AIChatAssistant: React.FC = () => {
  const { isChatOpen, setIsChatOpen, activeVehicle, activeDiagnosis } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello! I'm your Mechanic AI assistant. I'm calibrated with telemetry for your ${activeVehicle.make} ${activeVehicle.model} (${activeVehicle.mileage.toLocaleString()} km). How can I assist with your vehicle today?`,
      timestamp: 'Just now',
      suggestions: [
        'Why is my bike overheating?',
        'How often should I change engine oil?',
        'What does the battery warning light mean?',
        'Is it safe to ride with starting clicks?',
        'Why is my mileage decreasing?',
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // AI Automotive Knowledge Simulation
    setTimeout(() => {
      let reply = '';
      const q = text.toLowerCase();

      if (q.includes('overheat') || q.includes('temperature') || q.includes('hot')) {
        reply = `On your ${activeVehicle.make} ${activeVehicle.model}, engine overheating in traffic typically stems from three causes:\n\n1. **Low Coolant Level or Cavitation:** Check reservoir tank behind fairing.\n2. **Thermostat Stuck Closed:** Prevents hot fluid from passing into the radiator.\n3. **Radiator Fan Relay Failure:** If the fan does not spin at >98°C, convective cooling drops to zero during stops.\n\n*Safety Advisory:* Do not open the radiator cap while warm. Allow 40 minutes of cool-down time.`;
      } else if (q.includes('oil') || q.includes('change')) {
        reply = `For the ${activeVehicle.make} ${activeVehicle.model}, the recommended engine oil interval is:\n\n• **Fully Synthetic (10W-40):** Every 4,000 – 5,000 km.\n• **Semi-Synthetic:** Every 3,000 km.\n\nYour odometer is currently ${activeVehicle.mileage.toLocaleString()} km. Our predictive engine estimates your oil health is at 32%, meaning a flush is due in ~850 km.`;
      } else if (q.includes('click') || q.includes('start') || q.includes('crank') || q.includes('battery')) {
        reply = `The rapid clicking sound when pressing the starter button indicates that your starter solenoid is receiving under 10.4V.\n\nWhen battery voltage drops during high-amp draw, the relay contact repeatedly bounces open and closed. In 90% of cases on 2022-2024 Yamaha models, replacing the 12V 5Ah VRLA battery (approx ₹2,800) completely resolves this.`;
      } else if (q.includes('warning') || q.includes('light') || q.includes('mil')) {
        reply = `Dashboard warning lights fall into three urgency levels:\n\n🔴 **Red (Immediate Stop):** Oil Pressure / Engine Temperature / Battery Charging Failure.\n🟡 **Amber (Caution / Service Soon):** Check Engine (MIL) / ABS / O2 Sensor.\n🔵 **Blue/Green:** High beam / Turn signals.\n\nIf the Battery light is illuminated, your stator/alternator is not charging the battery, and the bike will stall once reserve energy is depleted.`;
      } else if (q.includes('mileage') || q.includes('fuel') || q.includes('efficiency')) {
        reply = `Decreased fuel economy on modern fuel-injected bikes is usually caused by:\n\n1. **Clogged Air Filter:** Starves engine of air, causing ECU to enrich mixture.\n2. **Under-inflated Tyres:** Increases rolling resistance by 15-20%.\n3. **Fouled Spark Plug:** Incomplete combustion leaves unburnt fuel in exhaust.\n4. **Dragging Brake Caliper:** Creates parasitic friction against rotor.`;
      } else {
        reply = `Thank you for the query regarding your ${activeVehicle.make} ${activeVehicle.model}. Based on our automotive knowledge base, this condition should be inspected. Would you like me to guide you through a step-by-step AI diagnosis or connect you with a certified technician at Raj Auto Care?`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Run Full AI Diagnosis', 'Find a Mechanic Nearby', 'Check Maintenance Due'],
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    }, 900);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all cursor-pointer transform hover:scale-105 active:scale-95 group"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
          </div>
          <span>Ask Mechanic AI</span>
        </button>
      )}

      {/* Chat Drawer Window */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[420px] h-[550px] max-h-[85vh] rounded-3xl bg-[#090e1a] border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Top Bar */}
          <div className="p-4 bg-gradient-to-r from-[#0c1628] to-[#0e1c33] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white font-['Outfit']">Mechanic AI</h3>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Calibrated for {activeVehicle.make} {activeVehicle.model}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tr-none shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-line leading-relaxed'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-semibold text-cyan-400 block">
                        Quick Inquiries:
                      </span>
                      <div className="flex flex-col gap-1">
                        {msg.suggestions.map((sug, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(sug)}
                            className="text-left text-[11px] p-1.5 rounded-lg bg-slate-950/80 hover:bg-cyan-500/10 hover:text-cyan-300 border border-slate-800/80 text-slate-300 transition-colors flex items-center justify-between"
                          >
                            <span>{sug}</span>
                            <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <span
                    className={`text-[9px] block text-right font-mono ${
                      msg.sender === 'user' ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="font-mono text-[11px]">Mechanic AI is querying automotive ontology...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-800 bg-[#070c16]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about warning lights, repairs, sounds..."
                className="flex-1 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
