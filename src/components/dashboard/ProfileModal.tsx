import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { currentUser } from '../../data/mockData';
import {
  X,
  User,
  Car,
  History,
  RotateCcw,
  Mail,
  Phone,
  MapPin,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const {
    vehicles,
    serviceReports,
    resetAllDemoData,
    supabaseConnected,
    supabaseLatency,
    isSyncing,
    refreshFromSupabase,
  } = useApp();

  const [syncSuccess, setSyncSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSync = async () => {
    await refreshFromSupabase();
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0d1424] border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-left space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                User Profile & Garage
              </h3>
              <p className="text-xs text-slate-400">
                Automotive owner credentials and telemetry records
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

        {/* Profile Card */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-cyan-500/40"
          />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white font-['Outfit']">{currentUser.name}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentUser.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentUser.city}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <Car className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="text-lg font-bold text-white font-mono">{vehicles.length}</span>
              <p className="text-[11px] text-slate-400">Registered Vehicles</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <History className="w-5 h-5 text-purple-400" />
            <div>
              <span className="text-lg font-bold text-white font-mono">
                {serviceReports.length}
              </span>
              <p className="text-[11px] text-slate-400">Past Verified Services</p>
            </div>
          </div>
        </div>

        {/* Supabase Connection Status Card */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white font-['Outfit']">
                Supabase Cloud Database
              </span>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                supabaseConnected
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  supabaseConnected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              {supabaseConnected ? `Live (${supabaseLatency ?? 0}ms)` : 'Connecting'}
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Project Endpoint:</span>
              <span className="font-mono text-[10px] text-slate-300 truncate max-w-[200px]">
                https://mqibouktqoqaiszjfvhw.supabase.co
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Tables Defined:</span>
              <span className="text-white font-medium">9 PostgreSQL Tables</span>
            </div>
          </div>

          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>
              {isSyncing
                ? 'Syncing Database...'
                : syncSuccess
                ? 'Synced Successfully!'
                : 'Refresh from Supabase Cloud'}
            </span>
          </button>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <button
            onClick={() => {
              resetAllDemoData();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial State</span>
          </button>
        </div>
      </div>
    </div>
  );
};
