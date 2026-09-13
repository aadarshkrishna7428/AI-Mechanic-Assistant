import React, { useState } from 'react';
import { Mechanic, AIDiagnosisResult } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Wrench,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mechanic: Mechanic | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  mechanic,
}) => {
  const {
    activeVehicle,
    activeDiagnosis,
    createServiceRequest,
    setCurrentView,
  } = useApp();

  const [serviceType, setServiceType] = useState<'Shop Visit' | 'Doorstep Pickup'>('Shop Visit');
  const [preferredDate, setPreferredDate] = useState('Today, Express Slot');
  const [preferredTime, setPreferredTime] = useState('02:30 PM');
  const [customerNotes, setCustomerNotes] = useState(
    'Please verify battery load voltage before replacing starter solenoid.'
  );

  if (!isOpen || !mechanic) return null;

  const defaultCostEstimate = activeDiagnosis?.costEstimate || {
    totalMin: 3000,
    totalMax: 5000,
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();

    // Create service request using active diagnosis (or fallback standard diagnosis)
    const diagnosisToUse: AIDiagnosisResult = activeDiagnosis || {
      id: `diag-fallback`,
      vehicleId: activeVehicle.id,
      symptomSummary: 'Starting issue & rapid clicking sound',
      probableIssue: 'Battery / Starter System Issue',
      confidence: 82,
      rankedCauses: [],
      xaiReasoning: 'Starter solenoid clicking indicates insufficient cranking voltage.',
      symptomsDetected: ['Clicking sound', 'Difficulty starting'],
      evidenceUsed: ['User description', 'Vehicle battery age'],
      recommendedAction: 'Inspect battery voltage and starter connections.',
      possibleRepair: 'Battery replacement & terminal cleaning',
      urgency: 'Medium',
      canIDrive: { safe: false, advice: 'Head straight to workshop.' },
      disclaimer: 'AI recommendations are for decision support.',
      costEstimate: {
        partsMin: 2500,
        partsMax: 4000,
        labourMin: 500,
        labourMax: 1000,
        totalMin: 3000,
        totalMax: 5000,
        localMarketRange: { min: 3200, max: 5400 },
        partsBreakdown: [
          { partName: 'OEM 12V 5Ah VRLA Battery', estimatedCost: 2850, isRequired: true },
          { partName: 'Terminal Cleaning & Treatment', estimatedCost: 180, isRequired: true },
        ],
      },
      createdAt: 'Just now',
    };

    createServiceRequest(diagnosisToUse, mechanic.id, serviceType);
    onClose();
    setCurrentView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0c1424] border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-left space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                Confirm Service Booking
              </h3>
              <p className="text-xs text-slate-400">
                Authorized work order with AI diagnostic telemetry lock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirmBooking} className="space-y-4">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
              <span className="text-slate-400">Selected Vehicle:</span>
              <span className="font-bold text-white">
                {activeVehicle.make} {activeVehicle.model} ({activeVehicle.plateNumber})
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
              <span className="text-slate-400">Problem Description:</span>
              <span className="font-medium text-slate-200 truncate max-w-[240px]">
                {activeDiagnosis ? activeDiagnosis.symptomSummary : 'Starting issue & clicking'}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
              <span className="text-slate-400">AI Diagnosis:</span>
              <span className="font-bold text-cyan-400">
                {activeDiagnosis
                  ? `${activeDiagnosis.probableIssue} (${activeDiagnosis.confidence}%)`
                  : 'Battery / Starter System Issue (82%)'}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
              <span className="text-slate-400">AI Estimated Cost:</span>
              <span className="font-bold text-emerald-400 font-mono">
                ₹{defaultCostEstimate.totalMin.toLocaleString()} – ₹{defaultCostEstimate.totalMax.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Selected Workshop:</span>
              <span className="font-bold text-white flex items-center gap-1">
                {mechanic.name} ({mechanic.workshop})
              </span>
            </div>
          </div>

          {/* Service Mode Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Service Delivery Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setServiceType('Shop Visit')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  serviceType === 'Shop Visit'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Workshop Drive-in ({mechanic.distanceKm} km)
              </button>
              <button
                type="button"
                onClick={() => setServiceType('Doorstep Pickup')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  serviceType === 'Doorstep Pickup'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Doorstep Pickup (+₹150)
              </button>
            </div>
          </div>

          {/* Date & Time Slot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Preferred Date
              </label>
              <select
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
              >
                <option value="Today, Express Slot">Today (Express Slot)</option>
                <option value="Tomorrow Morning">Tomorrow Morning</option>
                <option value="Tomorrow Afternoon">Tomorrow Afternoon</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Time Window
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
              >
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="04:45 PM">04:45 PM</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Instructions for Technician
            </label>
            <input
              type="text"
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Transparency Guarantee */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 text-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>
              <strong>Transparent Price Lock Guarantee:</strong> Final bill must conform to the AI diagnostic range. Any unquoted parts require explicit app authorization.
            </span>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
            >
              <span>Confirm & Generate Service Order</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
