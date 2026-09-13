import React from 'react';
import { Wrench, Shield, Cpu, Sparkles, Heart, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="border-t border-slate-800 bg-[#060910] text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px]">
                <div className="w-full h-full bg-[#080c14] rounded-[11px] flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight font-['Outfit']">
                AI Mechanic Assistant
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Understand your vehicle. Know the problem. Repair with confidence. An AI-first platform bridging vehicle telemetry, explainable diagnostics, and fair mechanical repair pricing.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Inference Engine v2.4 Online
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Cpu className="w-3 h-3" />
                Multimodal Vision & Acoustic
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 font-['Outfit']">
              Platform Features
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => { setCurrentView('diagnose'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  AI Symptom Diagnosis
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView('mechanics'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Certified Mechanics Finder
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView('tracking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Live Service Tracking
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView('maintenance'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Smart Predictive Maintenance
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView('history'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Transparent Service Reports
                </button>
              </li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3 font-['Outfit']">
              Transparency Pillar
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Explainable AI (XAI) transparent reasoning for all automotive diagnoses.</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Dual Cost Projections: OEM Parts + Certified Regional Labour rates in Indian Rupees (₹).</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AI Mechanic Assistant. Built for AI Innovation & Hackathons.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Indian Automotive Diagnostic Standard (OBD-II & Multimodal)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
