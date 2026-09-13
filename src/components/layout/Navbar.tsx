import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  Cpu,
  Car,
  History,
  Activity,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  RotateCcw,
  User,
  Radio,
  Clock,
} from 'lucide-react';
import { currentUser } from '../../data/mockData';

interface NavbarProps {
  onOpenVehicleModal: () => void;
  onOpenProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenVehicleModal, onOpenProfileModal }) => {
  const { currentView, setCurrentView, activeVehicle, activeServiceRequest, resetAllDemoData } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'diagnose', label: 'AI Diagnosis', highlight: true },
    { id: 'mechanics', label: 'Mechanics' },
    {
      id: 'tracking',
      label: 'Live Tracking',
      badge: activeServiceRequest?.currentStageIndex !== undefined && activeServiceRequest.currentStageIndex < 5 ? 'Live' : undefined,
    },
    { id: 'history', label: 'Service History' },
    { id: 'maintenance', label: 'Smart Maintenance' },
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    resetAllDemoData();
    setResetConfirm(true);
    setTimeout(() => setResetConfirm(false), 2500);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleNavClick('landing')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-[#080c14] rounded-[11px] flex items-center justify-center">
                <Wrench className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white font-['Outfit']">
                  AI Mechanic
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  ASSISTANT
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
                Intelligent Vehicle Diagnostics & Transparency
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-cyan-400 bg-cyan-500/10 shadow-sm border border-cyan-500/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                      <Radio className="w-2.5 h-2.5 mr-0.5" />
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Active Vehicle Switcher Pill */}
            <button
              onClick={onOpenVehicleModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 text-xs text-slate-200 transition-all group"
              title="Click to switch or manage vehicles"
            >
              <Car className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="font-semibold text-white block leading-tight max-w-[110px] truncate">
                  {activeVehicle.make} {activeVehicle.model}
                </span>
                <span className="text-[10px] text-slate-400">{activeVehicle.plateNumber}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Reset Demo Data button */}
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50 text-xs transition-all"
              title="Reset Demo Data to Initial State"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${resetConfirm ? 'text-emerald-400 animate-spin' : ''}`} />
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-1.5 p-1 rounded-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all"
              title="View Profile & Garage"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-cyan-500/40"
              />
            </button>

            {/* Primary CTA */}
            <button
              onClick={() => handleNavClick('diagnose')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Start Diagnosis</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenVehicleModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300"
            >
              <Car className="w-3 h-3 text-cyan-400" />
              <span className="max-w-[80px] truncate">{activeVehicle.model}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0c121e]/98 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full ring-1 ring-cyan-500"
              />
              <div>
                <p className="text-sm font-semibold text-white">{currentUser.name}</p>
                <p className="text-xs text-slate-400">{currentUser.city}</p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Demo
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                  currentView === item.id
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleNavClick('diagnose')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/30"
            >
              <Sparkles className="w-4 h-4" /> Start AI Diagnosis
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
