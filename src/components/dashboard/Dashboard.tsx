import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Car,
  Wrench,
  Sparkles,
  Camera,
  Mic,
  Calendar,
  Clock,
  Compass,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  ArrowRight,
  Activity,
  CheckCircle2,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';

interface DashboardProps {
  onOpenVehicleModal: () => void;
  onOpenImageModal: () => void;
  onOpenAudioModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenVehicleModal,
  onOpenImageModal,
  onOpenAudioModal,
}) => {
  const {
    activeVehicle,
    activeDiagnosis,
    activeServiceRequest,
    maintenancePredictions,
    serviceReports,
    setCurrentView,
  } = useApp();

  const nextMaintenance = maintenancePredictions[0];
  const recentReport = serviceReports[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
            VEHICLE TELEMETRY COCKPIT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-['Outfit']">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time diagnostics, health telemetry, and service orchestration for your vehicle.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('diagnose')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Run AI Diagnosis</span>
          </button>
        </div>
      </div>

      {/* Primary Row: Vehicle Spec Card & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Vehicle Card (Detailed) */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 sm:p-7 relative overflow-hidden border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[90px] pointer-events-none rounded-full" />

          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={activeVehicle.image}
                alt={activeVehicle.model}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-cyan-500/30 shadow-lg shadow-black/60"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase">
                    {activeVehicle.type}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {activeVehicle.plateNumber}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white mt-1 font-['Outfit']">
                  {activeVehicle.make} {activeVehicle.model}
                </h2>
                <p className="text-xs text-slate-400">{activeVehicle.engineType}</p>
              </div>
            </div>

            <button
              onClick={onOpenVehicleModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Switch / Edit Vehicle</span>
            </button>
          </div>

          {/* Vehicle Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Year of Make</span>
              <span className="text-base font-bold text-white font-mono">{activeVehicle.year}</span>
              <span className="text-[10px] text-slate-500 block">{activeVehicle.fuelType}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Current Odometer</span>
              <span className="text-base font-bold text-white font-mono">
                {activeVehicle.mileage.toLocaleString()} km
              </span>
              <span className="text-[10px] text-cyan-400 block">Verified Telemetry</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Last Service</span>
              <span className="text-base font-bold text-white font-mono">
                {activeVehicle.lastServiceDate}
              </span>
              <span className="text-[10px] text-emerald-400 block">Report Verified</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Next Service Due</span>
              <span className="text-base font-bold text-amber-400 font-mono">
                {activeVehicle.nextServiceKm.toLocaleString()} km
              </span>
              <span className="text-[10px] text-slate-500 block">Remaining buffer</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-6 border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-1 font-['Outfit']">
              Quick Diagnostic Actions
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Instant AI vehicle inspection entrypoints
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => setCurrentView('diagnose')}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-cyan-500/15 to-blue-500/10 hover:from-cyan-500/25 hover:to-blue-500/20 border border-cyan-500/30 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">
                      Diagnose a Problem
                    </h4>
                    <p className="text-[10px] text-slate-400">Full 4-step wizard with XAI</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </button>

              <button
                onClick={onOpenImageModal}
                className="w-full p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-blue-300">
                      Upload Vehicle Image
                    </h4>
                    <p className="text-[10px] text-slate-400">Tyre, brake, or engine damage</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </button>

              <button
                onClick={onOpenAudioModal}
                className="w-full p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-purple-300">
                      Record Engine Sound
                    </h4>
                    <p className="text-[10px] text-slate-400">Acoustic resonance analyzer</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </button>

              <button
                onClick={() => setCurrentView('mechanics')}
                className="w-full p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">
                      Find a Mechanic
                    </h4>
                    <p className="text-[10px] text-slate-400">Certified local garages & rates</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Service Status Banner (If in progress) */}
      {activeServiceRequest && (
        <div className="glass-panel rounded-2xl p-5 sm:p-6 border-cyan-500/30 bg-gradient-to-r from-[#0c1628] to-[#0d1c33] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  ACTIVE SERVICE ORDER • {activeServiceRequest.id}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit']">
                {activeServiceRequest.problemTitle}
              </h3>
              <p className="text-xs text-slate-300">
                Current Stage:{' '}
                <span className="text-cyan-300 font-semibold">
                  {activeServiceRequest.stages[activeServiceRequest.currentStageIndex]?.title}
                </span>{' '}
                • Est. Completion: {activeServiceRequest.estimatedCompletion}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('tracking')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <span>Track Live Progress</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5 Core Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Latest AI Diagnosis */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                AI DIAGNOSIS
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {activeDiagnosis ? `${activeDiagnosis.confidence}% Conf.` : '82% Baseline'}
              </span>
            </div>

            <h4 className="text-lg font-bold text-white font-['Outfit']">
              {activeDiagnosis ? activeDiagnosis.probableIssue : 'Battery / Starter System Issue'}
            </h4>

            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
              {activeDiagnosis
                ? activeDiagnosis.xaiReasoning
                : 'Rapid clicking without turnover indicates low battery amperage unable to sustain solenoid cranking draw.'}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Urgency:{' '}
              <span className="text-amber-400 font-semibold">
                {activeDiagnosis ? activeDiagnosis.urgency : 'Medium'}
              </span>
            </span>
            <button
              onClick={() => {
                if (activeDiagnosis) {
                  setCurrentView('result');
                } else {
                  setCurrentView('diagnose');
                }
              }}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>{activeDiagnosis ? 'View AI Report' : 'Inspect Details'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Upcoming Maintenance */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                PREDICTIVE MAINTENANCE
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Due in {nextMaintenance.dueInKm} km
              </span>
            </div>

            <h4 className="text-lg font-bold text-white font-['Outfit']">
              {nextMaintenance.component}
            </h4>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Health Life Remaining</span>
                <span className="font-mono text-amber-400 font-bold">
                  {nextMaintenance.currentHealthPct}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full"
                  style={{ width: `${nextMaintenance.currentHealthPct}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
              {nextMaintenance.aiInsight}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Priority: <span className="text-amber-400 font-semibold">{nextMaintenance.priority}</span>
            </span>
            <button
              onClick={() => setCurrentView('maintenance')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View Predictions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 3: Estimated Repair Cost */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                ESTIMATED REPAIR COST
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Transparent Projections
              </span>
            </div>

            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {activeDiagnosis
                  ? `₹${activeDiagnosis.costEstimate.totalMin.toLocaleString()} – ₹${activeDiagnosis.costEstimate.totalMax.toLocaleString()}`
                  : '₹3,000 – ₹5,000'}
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Parts (₹2,500 – ₹4,000) + Labour (₹500 – ₹1,000)
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
              Compared to typical local garage range (₹3,200 – ₹5,400).
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Includes OEM Battery</span>
            <button
              onClick={() => setCurrentView('mechanics')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Find Suitable Mechanic</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 4: Recent Service History Snapshot */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                RECENT SERVICE
              </span>
              <span className="text-xs text-slate-400">{recentReport.completionDate}</span>
            </div>

            <h4 className="text-lg font-bold text-white font-['Outfit']">
              {recentReport.aiDiagnosis.split('(')[0]}
            </h4>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Workshop:</span>
              <span className="text-white font-medium">{recentReport.mechanic.name}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Final Bill:</span>
              <span className="text-emerald-400 font-bold font-mono">
                ₹{recentReport.finalBill.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Within AI estimated range ✓</span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Inv: {recentReport.invoiceNumber}</span>
            <button
              onClick={() => setCurrentView('history')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>View Full History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 5: Service Status */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                SERVICE STATUS
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                {activeServiceRequest ? 'In Progress' : 'Idle'}
              </span>
            </div>

            <h4 className="text-lg font-bold text-white font-['Outfit']">
              {activeServiceRequest
                ? activeServiceRequest.stages[activeServiceRequest.currentStageIndex]?.title
                : 'No Active Work Order'}
            </h4>

            <p className="text-xs text-slate-400 leading-relaxed">
              {activeServiceRequest
                ? activeServiceRequest.stages[activeServiceRequest.currentStageIndex]?.technicianNote
                : 'All routine maintenance and diagnostic repairs are up to date.'}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Stage {(activeServiceRequest?.currentStageIndex || 0) + 1} of 6
            </span>
            <button
              onClick={() => setCurrentView('tracking')}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Open Tracking</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
