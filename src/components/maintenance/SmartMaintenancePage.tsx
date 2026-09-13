import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  AlertTriangle,
  Clock,
  Car,
  Sparkles,
  CheckCircle2,
  Wrench,
  ChevronRight,
  TrendingDown,
  Activity,
  Shield,
} from 'lucide-react';

export const SmartMaintenancePage: React.FC = () => {
  const { maintenancePredictions, activeVehicle, setCurrentView } = useApp();

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Medium':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              WEAR DEGRADATION ALGORITHM
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Smart Maintenance Predictions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Predictive maintenance models calibrated on {activeVehicle.mileage.toLocaleString()} km of telemetry for {activeVehicle.make} {activeVehicle.model}.
          </p>
        </div>

        <button
          onClick={() => {
            setCurrentView('diagnose');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Run Symptom Diagnosis</span>
        </button>
      </div>

      {/* AI Maintenance Insight Spotlight Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-amber-500/30 bg-gradient-to-br from-[#1c1409] via-[#140e06] to-[#0a0f1d] space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI Maintenance Insight</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
          “Based on your mileage and previous service history, chain maintenance is likely to be your next required service.”
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Telemetry indicates your drive chain has reached 4,150 km since last deep degreasing and lubrication. Addressing chain slack (currently estimated at 34mm) now prevents premature sprocket teeth wear and ₹3,500 replacement costs.
        </p>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {maintenancePredictions.map((pred) => (
          <div
            key={pred.id}
            className="glass-panel rounded-2xl p-6 border-slate-800 flex flex-col justify-between hover:border-amber-500/40 transition-all space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {pred.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(
                    pred.priority
                  )}`}
                >
                  {pred.priority} Priority
                </span>
              </div>

              <h4 className="text-lg font-bold text-white font-['Outfit']">
                {pred.component}
              </h4>

              {/* Health Remaining Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Component Health:</span>
                  <span className="font-mono font-bold text-white">{pred.currentHealthPct}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full ${
                      pred.currentHealthPct < 25
                        ? 'bg-rose-500'
                        : pred.currentHealthPct < 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pred.currentHealthPct}%` }}
                  />
                </div>
              </div>

              {/* Due metrics */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Due In:</span>
                  <span className="font-bold text-amber-400 font-mono text-sm">
                    {pred.dueInKm} km
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Estimated Window:</span>
                  <span className="font-bold text-white font-mono text-sm">
                    ~{pred.dueInDays} Days
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {pred.aiInsight}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                Recommended Action:
              </span>
              <p className="text-xs font-semibold text-slate-200">{pred.recommendedService}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Maintenance Roadmap Visualizer */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white font-['Outfit']">
          Upcoming Maintenance Milestones (Next 6,000 km)
        </h3>

        <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 ring-4 ring-slate-900" />
            <div className="space-y-1">
              <span className="text-xs font-mono text-amber-400 font-bold">In 500 km</span>
              <h4 className="text-sm font-bold text-white">Drive Chain Slack & Lube</h4>
              <p className="text-xs text-slate-400">Prevent tooth wear on drive sprockets.</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-400 ring-4 ring-slate-900" />
            <div className="space-y-1">
              <span className="text-xs font-mono text-amber-300 font-bold">In 850 km</span>
              <h4 className="text-sm font-bold text-white">Synthetic Engine Oil & Filter Flush</h4>
              <p className="text-xs text-slate-400">Restore optimal thermal viscosity and engine cooling.</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-rose-500 ring-4 ring-slate-900" />
            <div className="space-y-1">
              <span className="text-xs font-mono text-rose-400 font-bold">In 1,200 km</span>
              <h4 className="text-sm font-bold text-white">Front Brake Caliper & Pad Renewal</h4>
              <p className="text-xs text-slate-400">Critical safety threshold: friction depth under 2.0mm.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
