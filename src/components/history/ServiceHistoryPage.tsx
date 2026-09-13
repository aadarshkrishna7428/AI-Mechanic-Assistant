import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceReport } from '../../types';
import { ServiceReportModal } from '../reports/ServiceReportModal';
import {
  History,
  FileCheck,
  CheckCircle2,
  Car,
  Wrench,
  DollarSign,
  ChevronRight,
  Search,
  Filter,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export const ServiceHistoryPage: React.FC = () => {
  const { serviceReports, activeVehicle } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<ServiceReport | null>(null);

  const filteredReports = serviceReports.filter((rep) => {
    return (
      rep.aiDiagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.mechanic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.serviceIdDisplay.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
              <History className="w-3.5 h-3.5 text-purple-400" />
              DIGITAL LOGBOOK
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Service History & Invoices
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Historical log of all maintenance, AI diagnostics, and certified workshop invoices.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search past repairs or invoice #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* History Cards / Table */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="glass-panel rounded-2xl p-6 border-slate-800 hover:border-cyan-500/40 transition-all space-y-4"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Left Column */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/30">
                    {report.serviceIdDisplay}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-300">
                    {report.vehicle.make} {report.vehicle.model} ({report.vehicle.plateNumber})
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-400">{report.completionDate}</span>
                </div>

                <h3 className="text-lg font-bold text-white font-['Outfit']">
                  {report.aiDiagnosis}
                </h3>

                <p className="text-xs text-slate-300">
                  <strong className="text-slate-400">Workshop:</strong> {report.mechanic.workshop} (
                  {report.mechanic.name})
                </p>
              </div>

              {/* Right Column (Costs & CTA) */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0">
                <div className="text-left lg:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Settled Bill
                  </span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    ₹{report.finalBill.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Within AI estimate ✓</span>
                </div>

                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-bold text-xs transition-all cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Detailed Report</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Replaced Parts Pill Strip */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 text-[11px] uppercase font-bold">
                Replaced Parts:
              </span>
              {report.partsReplaced.map((part, pIdx) => (
                <span
                  key={pIdx}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px]"
                >
                  {part}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <ServiceReportModal
          isOpen={Boolean(selectedReport)}
          onClose={() => setSelectedReport(null)}
          report={selectedReport}
        />
      )}
    </div>
  );
};
