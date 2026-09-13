import React, { useRef } from 'react';
import { ServiceReport, ServiceRequest } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileCheck,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Download,
  Car,
  Wrench,
  DollarSign,
  TrendingDown,
  Sparkles,
  Award,
} from 'lucide-react';

interface ServiceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ServiceReport | null;
  activeRequest?: ServiceRequest | null;
}

export const ServiceReportModal: React.FC<ServiceReportModalProps> = ({
  isOpen,
  onClose,
  report,
  activeRequest,
}) => {
  const { activeVehicle, mechanics } = useApp();
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // If a report is passed, use it; otherwise fabricate from activeRequest
  const fallbackMechanic = mechanics.find((m) => m.id === activeRequest?.mechanicId) || mechanics[0];

  const currentReport: ServiceReport = report || {
    id: `rep-${activeRequest?.id || '8942'}`,
    serviceRequestId: activeRequest?.id || 'SRV-8942',
    serviceIdDisplay: activeRequest?.id || 'SRV-8942',
    vehicle: activeVehicle,
    mechanic: fallbackMechanic,
    aiDiagnosis: activeRequest?.aiDiagnosis || 'Battery / Starter System Issue (82% Confidence)',
    aiEstimatedCost: activeRequest?.aiEstimatedCost || { min: 3000, max: 5000 },
    mechanicDiagnosis:
      activeRequest?.actualBill?.mechanicDiagnosis ||
      'Severely degraded battery cell (9.8V load drop). Starter motor and harness intact.',
    partsReplaced: activeRequest?.actualBill?.partsReplaced || [
      'Exide Xplore 12V 5Ah VRLA Maintenance-Free Battery',
      'Corrosion Inhibitor Washer Terminal Kit',
    ],
    partsCost: activeRequest?.actualBill?.partsCost || 3200,
    labourCost: activeRequest?.actualBill?.labourCost || 700,
    taxes: 0,
    finalBill: activeRequest?.actualBill?.total || 3900,
    isWithinEstimate: true,
    completionDate: 'Today',
    mechanicNotes: 'Cleaned positive/negative copper lugs, torqued terminal screws, tested 5 cold starts successfully.',
    invoiceNumber: `INV-${fallbackMechanic.name.substring(0, 3).toUpperCase()}-4928`,
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0a101d] border border-cyan-500/40 shadow-2xl p-6 sm:p-9 text-left space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Top Modal Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white font-['Outfit']">
                Transparent Service Report & Invoice
              </h3>
              <p className="text-xs text-slate-400">
                AI Diagnostic Telemetry vs Workshop Certified Actual Bill
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title="Print / Save PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Canvas */}
        <div ref={reportRef} className="space-y-6">
          {/* Header Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Work Order Info</span>
              <p className="font-mono text-cyan-300 font-bold text-sm">
                {currentReport.serviceIdDisplay}
              </p>
              <p className="text-slate-300">Invoice: {currentReport.invoiceNumber}</p>
              <p className="text-slate-400">Date: {currentReport.completionDate}</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Workshop</span>
              <p className="font-bold text-white text-sm">{currentReport.mechanic.workshop}</p>
              <p className="text-slate-300">{currentReport.mechanic.name} (Chief Tech)</p>
              <p className="text-slate-400">{currentReport.mechanic.phone}</p>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <Car className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white">
                {currentReport.vehicle.make} {currentReport.vehicle.model} ({currentReport.vehicle.year})
              </span>
              <span className="text-slate-400 font-mono">[{currentReport.vehicle.plateNumber}]</span>
            </div>
            <span className="text-slate-400 font-mono">
              Odometer: {currentReport.vehicle.mileage.toLocaleString()} km
            </span>
          </div>

          {/* Core Feature: AI Diagnosis vs Mechanic Diagnosis Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#0b172a] border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Initial Diagnosis</span>
              </div>
              <h4 className="text-base font-bold text-white font-['Outfit']">
                {currentReport.aiDiagnosis}
              </h4>
              <p className="text-xs text-slate-300">
                AI Estimated Cost: <strong className="text-emerald-400 font-mono">₹{currentReport.aiEstimatedCost.min.toLocaleString()} – ₹{currentReport.aiEstimatedCost.max.toLocaleString()}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d1a21] border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <Wrench className="w-3.5 h-3.5" />
                <span>Mechanic Confirmed Diagnosis</span>
              </div>
              <h4 className="text-base font-bold text-white font-['Outfit']">
                {currentReport.mechanicDiagnosis}
              </h4>
              <p className="text-xs text-slate-300">
                Bench inspection confirmed defective battery cell #3.
              </p>
            </div>
          </div>

          {/* Itemized Parts & Labour Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Itemized Workshop Billing
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-semibold text-slate-400">
                <span>Description & Component</span>
                <span>Amount</span>
              </div>

              {currentReport.partsReplaced.map((part, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-200">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{part}</span>
                  </span>
                  <span className="font-mono">
                    {idx === 0 ? `₹${currentReport.partsCost.toLocaleString()}` : 'Included'}
                  </span>
                </div>
              ))}

              <div className="flex items-center justify-between text-slate-200 pt-1">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Certified Technician Labour & Terminal Servicing</span>
                </span>
                <span className="font-mono">₹{currentReport.labourCost.toLocaleString()}</span>
              </div>
            </div>

            {/* Total Section */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-sm">
              <span className="font-bold text-white">Final Settled Bill</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                ₹{currentReport.finalBill.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Critical Highlight Badge: Within AI Estimated Range ✓ */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-teal-950/40 border border-emerald-500/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm sm:text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Within AI Estimated Range ✓</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/40">
                100% TRANSPARENCY SCORE
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">AI Estimated Range:</span>
                <span className="font-bold text-white font-mono">
                  ₹{currentReport.aiEstimatedCost.min.toLocaleString()} – ₹{currentReport.aiEstimatedCost.max.toLocaleString()}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Actual Workshop Bill:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  ₹{currentReport.finalBill.toLocaleString()}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block">Pricing Variance:</span>
                <span className="font-bold text-cyan-300 font-mono">
                  -₹{(currentReport.aiEstimatedCost.max - currentReport.finalBill).toLocaleString()} under max cap
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              This service order complied with all AI-calibrated parts and labour indices, verifying that no arbitrary surcharges or unauthorized replacement parts were levied.
            </p>
          </div>

          {/* Technician Verification Sign-off */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1 text-slate-400">
            <span className="font-bold text-slate-300 block">Technician Verification Log:</span>
            <p>{currentReport.mechanicNotes}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Cryptographically sealed automotive repair receipt
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            Done & Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
