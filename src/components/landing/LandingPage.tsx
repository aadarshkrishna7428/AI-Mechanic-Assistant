import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Mic,
  Camera,
  Activity,
  DollarSign,
  Compass,
  CheckCircle2,
  FileCheck,
  ChevronRight,
  Wrench,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, activeVehicle } = useApp();

  const handleStartDiagnosis = () => {
    setCurrentView('diagnose');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const demoScenarios = [
    {
      title: 'Starting Clicking Noise',
      vehicle: 'Yamaha MT-15 (2023)',
      icon: Zap,
      badge: 'Primary Showcase',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      symptom: '“My bike makes a clicking sound when I try to start it.”',
      probable: 'Battery / Starter Solenoid Drop (82% Confidence)',
      cost: '₹3,000 – ₹5,000',
    },
    {
      title: 'High-Pitched Brake Squeal',
      vehicle: 'Royal Enfield Classic 350',
      icon: AlertTriangle,
      badge: 'Acoustic & Wear',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      symptom: '“Loud scraping noise whenever front brake is pulled.”',
      probable: 'Friction Layer Glazing & Pad Replacement (86%)',
      cost: '₹1,600 – ₹2,900',
    },
    {
      title: 'Radiator Overheating in Traffic',
      vehicle: 'Tata Nexon / Hyundai i20',
      icon: Activity,
      badge: 'Thermal Telemetry',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      symptom: '“High temperature warning light & fan screaming.”',
      probable: 'Thermostat Valve / Fan Relay Defect (84%)',
      cost: '₹3,000 – ₹5,900',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 tech-grid">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/20 to-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Top Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Next-Gen Automotive AI Inference</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] font-['Outfit']">
                Your AI-powered <br />
                <span className="text-gradient-cyan">mechanic assistant.</span>
              </h1>

              {/* Tagline & Subheading */}
              <p className="text-lg sm:text-xl font-medium text-cyan-100/90 max-w-2xl font-['Outfit']">
                “Understand your vehicle. Know the problem. Repair with confidence.”
              </p>

              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Diagnose vehicle problems from symptoms, images, and sounds. Get explainable repair guidance, transparent cost estimates in Indian Rupees (₹), and trusted mechanic tracking from request to final invoice.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={handleStartDiagnosis}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-base shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
                >
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>Start AI Diagnosis</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 ml-1" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('features-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-semibold text-sm transition-all"
                >
                  <span>Explore Features</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Trust Section */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
                <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>AI Diagnosis</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Multimodal acoustic, visual & text inference
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Cost Transparency</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Parts + labour estimates in Indian Rupees (₹)
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold mb-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Service Tracking</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Interactive 6-stage live workshop progress
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Maintenance Prediction</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Wear & health degradation forecasts
                  </p>
                </div>
              </div>
            </div>

            {/* Right Automotive AI Visual / Telemetry Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Tech Frame */}
                <div className="rounded-2xl p-1 bg-gradient-to-b from-cyan-500/30 via-slate-800/50 to-slate-900 shadow-2xl shadow-cyan-500/10 border border-cyan-500/20">
                  <div className="rounded-[15px] bg-[#0c1322] p-5 sm:p-6 space-y-5">
                    {/* Telemetry Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                        <span className="text-xs font-mono text-cyan-300 font-semibold uppercase tracking-wider">
                          LIVE TELEMETRY STREAM
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {activeVehicle.make} {activeVehicle.model}
                      </span>
                    </div>

                    {/* Diagnostic Result Card Simulation */}
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 space-y-3 relative overflow-hidden">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
                            AI PROBABLE DIAGNOSIS
                          </span>
                          <h4 className="text-base font-bold text-white mt-0.5">
                            Battery / Starter System Issue
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            82% CONFIDENCE
                          </span>
                        </div>
                      </div>

                      {/* Waveform Acoustic Visualizer */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1 text-slate-300">
                            <Mic className="w-3 h-3 text-cyan-400" /> Starter Solenoid Acoustic
                          </span>
                          <span>18.4 Hz Resonance</span>
                        </div>
                        <div className="h-10 w-full bg-slate-950/80 rounded-lg p-1.5 flex items-center justify-between gap-1 border border-slate-800">
                          {[15, 30, 85, 20, 10, 95, 80, 25, 12, 90, 75, 18, 10, 88, 80, 22, 12, 90, 65, 15, 80, 95, 20].map(
                            (val, idx) => (
                              <div
                                key={idx}
                                style={{ height: `${val}%` }}
                                className={`w-full rounded-full transition-all ${
                                  val > 70
                                    ? 'bg-cyan-400'
                                    : val > 40
                                    ? 'bg-cyan-600'
                                    : 'bg-slate-700'
                                }`}
                              />
                            )
                          )}
                        </div>
                      </div>

                      {/* XAI Snippet */}
                      <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                        <span className="text-cyan-400 font-semibold">Explainable AI:</span> Rapid clicking without crank turnover indicates battery resting voltage &lt; 10.4V failing under starter draw.
                      </div>

                      {/* Transparent Cost Range */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-slate-400">Estimated Repair Cost:</span>
                        <span className="font-bold text-emerald-400 text-sm">₹3,000 – ₹5,000</span>
                      </div>
                    </div>

                    {/* Quick Launch CTA */}
                    <button
                      onClick={handleStartDiagnosis}
                      className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Test This Diagnostic In Realtime</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Differentiator Pipeline */}
      <section id="features-section" className="py-16 bg-[#0a0f1d] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
              THE AI MECHANIC FLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-['Outfit']">
              From Weird Noise to Transparent Final Bill
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              Most platforms just list random workshops. AI Mechanic Assistant delivers end-to-end intelligence: from multimodal diagnosis to verified actual repair invoices.
            </p>
          </div>

          {/* Workflow Steps Horizontal Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="glass-panel rounded-2xl p-6 relative border-slate-800/80 hover:border-cyan-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold mb-4 group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">
                Multimodal Input
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide vehicle symptoms via natural text, engine acoustic audio recordings, or photos of damaged parts & warning lights.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel rounded-2xl p-6 relative border-slate-800/80 hover:border-cyan-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold mb-4 group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">
                XAI & Ranked Causes
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive ranked probable causes with confidence scores, detailed plain-English reasoning, and "Can I drive?" safety advisory.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel rounded-2xl p-6 relative border-slate-800/80 hover:border-emerald-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold mb-4 group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">
                Cost Transparency (₹)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transparent itemized estimates for OEM parts and certified labour before you speak with any workshop or mechanic.
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-panel rounded-2xl p-6 relative border-slate-800/80 hover:border-purple-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold mb-4 group-hover:scale-110 transition-transform">
                04
              </div>
              <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">
                Tracking & Final Report
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track live workshop progress across 6 stages and receive a transparent invoice comparison: AI Estimate vs Actual Cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preset Demo Scenarios Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
                HACKATHON & DEMO PRESETS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-['Outfit']">
                Explore Real-World Automotive Diagnostic Cases
              </h2>
            </div>
            <button
              onClick={handleStartDiagnosis}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
            >
              <span>Custom Symptom Input</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoScenarios.map((scenario, index) => {
              const Icon = scenario.icon;
              return (
                <div
                  key={index}
                  onClick={handleStartDiagnosis}
                  className="glass-panel glass-panel-hover rounded-2xl p-6 cursor-pointer border-slate-800/80 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${scenario.badgeColor}`}
                      >
                        {scenario.badge}
                      </span>
                      <Icon className="w-5 h-5 text-slate-400" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white font-['Outfit']">
                        {scenario.title}
                      </h3>
                      <p className="text-xs text-cyan-300 font-mono mt-0.5">{scenario.vehicle}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs italic text-slate-300">
                      {scenario.symptom}
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider">
                        AI Inference:
                      </p>
                      <p className="text-white font-medium">{scenario.probable}</p>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Est. Range:</span>
                      <span className="text-sm font-bold text-emerald-400">{scenario.cost}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:underline">
                      Test Now <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
