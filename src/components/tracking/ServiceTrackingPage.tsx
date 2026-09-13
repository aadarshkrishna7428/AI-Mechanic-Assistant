import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceReportModal } from '../reports/ServiceReportModal';
import {
  Activity,
  CheckCircle2,
  Clock,
  Car,
  Wrench,
  Sparkles,
  Phone,
  MapPin,
  Play,
  RotateCcw,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Radio,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ServiceTrackingPage: React.FC = () => {
  const {
    activeServiceRequest,
    activeVehicle,
    mechanics,
    advanceServiceStage,
    resetServiceStage,
  } = useApp();

  const [isReportOpen, setIsReportOpen] = useState(false);

  if (!activeServiceRequest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Activity className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Active Service Orders</h2>
        <p className="text-sm text-slate-400">
          Run an AI diagnosis and request a service with a certified mechanic to track live repairs.
        </p>
      </div>
    );
  }

  const mechanic =
    mechanics.find((m) => m.id === activeServiceRequest.mechanicId) || mechanics[0];

  const currentStage = activeServiceRequest.stages[activeServiceRequest.currentStageIndex];
  const isFinalStage =
    activeServiceRequest.currentStageIndex === activeServiceRequest.stages.length - 1;

  const handleAdvance = () => {
    advanceServiceStage(activeServiceRequest.id);
    if (activeServiceRequest.currentStageIndex === activeServiceRequest.stages.length - 2) {
      // Reached final stage!
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.3 },
          colors: ['#10b981', '#06b6d4', '#f59e0b'],
        });
      } catch (e) {}
    }
  };

  const handleReset = () => {
    resetServiceStage(activeServiceRequest.id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              LIVE TELEMETRY TRACKER
            </span>
            <span className="text-xs font-mono text-slate-400">
              Order ID: <strong className="text-white">{activeServiceRequest.id}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
            Service Tracking & Workshop Status
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time stage progression verified by workshop technicians and IoT check-in scanners.
          </p>
        </div>

        {/* Demo / Hackathon Presenter Action Bar */}
        <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-900 border border-cyan-500/30">
          <span className="text-[11px] font-mono text-cyan-400 font-bold px-2 hidden sm:inline">
            DEMO CONTROLS:
          </span>
          <button
            onClick={handleAdvance}
            disabled={isFinalStage}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isFinalStage
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer'
            }`}
            title="Advance tracking to the next stage (for live hackathon presentations)"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isFinalStage ? 'Completed' : 'Simulate Next Stage'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
            title="Reset to Stage 2 (Vehicle Received)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Status Hero Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-cyan-500/30 bg-gradient-to-br from-[#0c1628] via-[#091120] to-[#070b14] space-y-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
              CURRENT STAGE ({activeServiceRequest.currentStageIndex + 1} OF 6)
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              {currentStage?.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {currentStage?.technicianNote}
            </p>
          </div>

          <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shrink-0 min-w-[210px]">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Estimated Ready Time
              </span>
              <p className="text-xl font-bold text-emerald-400 font-mono">
                {activeServiceRequest.estimatedCompletion}
              </p>
            </div>

            {isFinalStage && (
              <button
                onClick={() => setIsReportOpen(true)}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer animate-bounce"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>View Final Service Report</span>
              </button>
            )}
          </div>
        </div>

        {/* Vehicle & Workshop Metadata strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-3">
            <Car className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Vehicle:</span>
              <span className="font-bold text-white">
                {activeVehicle.make} {activeVehicle.model} ({activeVehicle.plateNumber})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Wrench className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Workshop:</span>
              <span className="font-bold text-white">{mechanic.name} ({mechanic.location.split(',')[0]})</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Support Hotline:</span>
              <span className="font-bold text-cyan-300 font-mono">{mechanic.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6-Stage Visual Timeline */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white font-['Outfit']">
          Service Lifecycle Timeline
        </h3>

        {/* Desktop Horizontal / Mobile Vertical Timeline */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
            {activeServiceRequest.stages.map((stage, idx) => {
              const isPassed = idx < activeServiceRequest.currentStageIndex;
              const isCurrent = idx === activeServiceRequest.currentStageIndex;
              const isPending = idx > activeServiceRequest.currentStageIndex;

              return (
                <div
                  key={stage.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative ${
                    isCurrent
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-500/10'
                      : isPassed
                      ? 'bg-slate-900/80 border-slate-700/80'
                      : 'bg-slate-950/40 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Stage number & Status icon */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                          isCurrent
                            ? 'bg-cyan-500 text-slate-950 font-black'
                            : isPassed
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        0{idx + 1}
                      </span>

                      {isPassed && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {isCurrent && (
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                        </span>
                      )}
                      {isPending && <Clock className="w-3.5 h-3.5 text-slate-600" />}
                    </div>

                    <h4
                      className={`text-xs font-bold font-['Outfit'] ${
                        isCurrent ? 'text-cyan-300' : isPassed ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {stage.title}
                    </h4>

                    {stage.timestamp && (
                      <p className="text-[10px] text-slate-400 font-mono">{stage.timestamp}</p>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug line-clamp-3">
                    {stage.technicianNote || 'Pending verification'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Mechanic Worklog Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Worklog Notes */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Technician Field Updates</span>
            </h3>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync
            </span>
          </div>

          <div className="space-y-3">
            {activeServiceRequest.stages
              .filter((s) => s.technicianNote && s.status !== 'pending')
              .map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-bold text-white font-['Outfit']">{s.title}</span>
                    <span className="font-mono text-[10px]">{s.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{s.technicianNote}</p>
                </div>
              ))}
          </div>
        </div>

        {/* Bill & Transparency Guarantee Sidebar */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 border-slate-800 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Bill Transparency Cap</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                AI Diagnostic Estimate
              </span>
              <p className="text-xl font-bold text-emerald-400 font-mono">
                ₹{activeServiceRequest.aiEstimatedCost.min.toLocaleString()} – ₹{activeServiceRequest.aiEstimatedCost.max.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Max bill ceiling locked in smart work order. No extra charges without your approval.
              </p>
            </div>

            <div className="text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Payment Status:</span>
                <span className="font-semibold text-amber-400">Pay at Workshop Pickup</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Warranty Coverage:</span>
                <span className="font-semibold text-white">48 Months on Battery</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsReportOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <FileCheck className="w-4 h-4" />
            <span>Open Transparent Service Report</span>
          </button>
        </div>
      </div>

      {/* Service Report Modal */}
      <ServiceReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        report={null}
        activeRequest={activeServiceRequest}
      />
    </div>
  );
};
