import React, { useEffect } from 'react';
import { AIDiagnosisResult, Vehicle } from '../../types';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  DollarSign,
  Info,
  Clock,
  Car,
  ChevronRight,
  ArrowRight,
  RotateCcw,
  Zap,
  HelpCircle,
  FileText,
  TrendingDown,
  Percent,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DiagnosisResultViewProps {
  diagnosis: AIDiagnosisResult;
  vehicle: Vehicle;
  onFindMechanic: () => void;
  onRediagnose: () => void;
}

export const DiagnosisResultView: React.FC<DiagnosisResultViewProps> = ({
  diagnosis,
  vehicle,
  onFindMechanic,
  onRediagnose,
}) => {
  // Fire subtle celebration on diagnosis render
  useEffect(() => {
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.25 },
        colors: ['#06b6d4', '#3b82f6', '#10b981'],
      });
    } catch (e) {}
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Top Banner: Diagnosis Result & Most Probable Issue */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-cyan-500/30 bg-gradient-to-br from-[#0c1729] via-[#091120] to-[#070b14] relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                AI DIAGNOSIS RESULT
              </span>
              <span className="text-xs font-mono text-slate-400">
                Vehicle: <strong className="text-white">{vehicle.make} {vehicle.model}</strong> ({vehicle.year})
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">{diagnosis.createdAt}</span>
            </div>

            <div>
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                Most Probable Issue
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 font-['Outfit']">
                {diagnosis.probableIssue}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed italic">
              “{diagnosis.symptomSummary}”
            </p>
          </div>

          {/* Confidence Badge */}
          <div className="flex flex-row lg:flex-col items-center justify-between lg:justify-center p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-center shrink-0 min-w-[190px]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block mb-1">
                INFERENCE ACCURACY
              </span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl sm:text-5xl font-black text-cyan-300 font-mono">
                  {diagnosis.confidence}
                </span>
                <span className="text-xl font-bold text-cyan-400">%</span>
              </div>
            </div>
            <span className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              HIGH CONFIDENCE
            </span>
          </div>
        </div>
      </div>

      {/* Section 6: Possible Causes Ranked with Progress Indicators */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Ranked Probable Causes
            </h3>
            <p className="text-xs text-slate-400">
              Probabilistic failure tree evaluated across automotive mechanical systems
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {diagnosis.rankedCauses.length} Causes Identified
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {diagnosis.rankedCauses.map((cause, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-2.5 transition-all hover:border-slate-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-xs font-bold text-cyan-400 font-mono">
                    {index + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white font-['Outfit']">
                    {cause.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold font-mono text-cyan-300">
                    {cause.confidence}% Match
                  </span>
                </div>
              </div>

              {/* Confidence Progress Bar */}
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    index === 0
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      : index === 1
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      : 'bg-slate-600'
                  }`}
                  style={{ width: `${cause.confidence}%` }}
                />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{cause.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 7: Explainable AI (Why AI thinks this is the problem) */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 border-cyan-500/30 bg-gradient-to-br from-[#0a1222] to-[#0d1627] space-y-6">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800/80">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-['Outfit']">
              Why AI thinks this is the problem (Explainable AI)
            </h3>
            <p className="text-xs text-cyan-300/80">
              Transparent mechanical causal logic & evidence correlation
            </p>
          </div>
        </div>

        {/* Narrative Reason */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/20 text-sm text-slate-200 leading-relaxed">
          <span className="font-bold text-cyan-400">Diagnostic Causal Rationale: </span>
          {diagnosis.xaiReasoning}
        </div>

        {/* Symptoms Detected & Evidence Used */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Symptoms Detected */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Symptoms Detected</span>
            </h4>
            <ul className="space-y-2">
              {diagnosis.symptomsDetected.map((symp, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                  <span>{symp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Evidence Used */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Evidence Correlated</span>
            </h4>
            <ul className="space-y-2">
              {diagnosis.evidenceUsed.map((evi, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                  <span>{evi}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Section 8: Repair Recommendation & Safety Advisory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Repair Recommendation */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span>Recommended Repair Protocol</span>
              </h3>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getUrgencyColor(
                  diagnosis.urgency
                )}`}
              >
                Urgency: {diagnosis.urgency}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Recommended Action
              </span>
              <p className="text-sm font-semibold text-white">
                {diagnosis.recommendedAction}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Possible Repair
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {diagnosis.possibleRepair}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-500 italic">
            {diagnosis.disclaimer}
          </div>
        </div>

        {/* Can I Drive? Safety Advisory */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              ROAD SAFETY ADVISORY
            </span>
            <h3 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Can I drive?</span>
            </h3>

            <div
              className={`p-4 rounded-xl border ${
                diagnosis.canIDrive.safe
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              }`}
            >
              <span className="text-xs font-bold block mb-1">
                {diagnosis.canIDrive.safe ? '✓ Conditionally Safe to Drive' : '⚠ Caution Advised'}
              </span>
              <p className="text-xs leading-relaxed">{diagnosis.canIDrive.advice}</p>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400">
            Preventative action now prevents stranded breakdowns and high roadside towing costs.
          </div>
        </div>
      </div>

      {/* Section 9: Estimated Repair Cost */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 border-emerald-500/30 bg-gradient-to-br from-[#08151f] to-[#0a1b18] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              COST TRANSPARENCY MODULE
            </span>
            <h3 className="text-xl font-extrabold text-white mt-0.5 font-['Outfit']">
              Estimated Repair Cost
            </h3>
          </div>
          <span className="text-xs font-medium text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
            Regional Standard: Bengaluru (₹ INR)
          </span>
        </div>

        {/* Cost Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Parts Cost</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">
              ₹{diagnosis.costEstimate.partsMin.toLocaleString()} – ₹{diagnosis.costEstimate.partsMax.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              OEM / Grade-A certified components
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Labour Charge</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">
              ₹{diagnosis.costEstimate.labourMin.toLocaleString()} – ₹{diagnosis.costEstimate.labourMax.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              1.0 - 1.5 technician hours
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
            <span className="text-xs text-emerald-300 font-bold block mb-1">Estimated Total</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              ₹{diagnosis.costEstimate.totalMin.toLocaleString()} – ₹{diagnosis.costEstimate.totalMax.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-300/80 block mt-1">
              All inclusive benchmark
            </span>
          </div>
        </div>

        {/* AI Estimated Cost vs Typical Local Service Range Visual Comparison */}
        <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">
              AI Fair Estimate vs Typical Local Workshop Range:
            </span>
            <span className="text-cyan-400 font-mono">Protects from overcharging</span>
          </div>

          {/* Dual bar comparison */}
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-mono">
                <span className="text-emerald-400 font-semibold">AI Estimated Range (Fair Market):</span>
                <span>₹{diagnosis.costEstimate.totalMin.toLocaleString()} – ₹{diagnosis.costEstimate.totalMax.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: '75%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-mono">
                <span className="text-slate-300 font-semibold">Typical Local Service Range:</span>
                <span>₹{diagnosis.costEstimate.localMarketRange.min.toLocaleString()} – ₹{diagnosis.costEstimate.localMarketRange.max.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-slate-500 h-full rounded-full opacity-60"
                  style={{ width: '92%' }}
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
            Certified mechanics in our network are contractually committed to honoring the transparent price bands determined by our AI diagnostics engine.
          </p>
        </div>

        {/* Parts Itemized List */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Anticipated Replacement Components:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {diagnosis.costEstimate.partsBreakdown.map((part, pIdx) => (
              <div
                key={pIdx}
                className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <span className="text-white font-medium">{part.partName}</span>
                <span className="font-mono text-emerald-400 font-bold">
                  ~₹{part.estimatedCost.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Conversion Section: Find Mechanic & Rediagnose */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-[#0c1322] border border-cyan-500/30">
        <div>
          <h4 className="text-lg font-bold text-white font-['Outfit']">
            Ready to resolve this problem?
          </h4>
          <p className="text-xs text-slate-400">
            Book a trusted workshop verified for {vehicle.make} repairs within your AI cost estimate.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onRediagnose}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Modify Symptoms</span>
          </button>

          <button
            onClick={onFindMechanic}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Wrench className="w-4 h-4 text-slate-950" />
            <span>Find a Mechanic for This Repair</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
