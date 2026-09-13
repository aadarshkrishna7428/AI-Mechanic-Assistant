import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mechanic } from '../../types';
import { BookingModal } from './BookingModal';
import {
  Wrench,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Car,
  ChevronRight,
  Phone,
  Sparkles,
  Award,
} from 'lucide-react';

export const MechanicFinder: React.FC = () => {
  const { mechanics, activeVehicle, activeDiagnosis } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedService, setSelectedService] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');
  const [selectedMechanicForBooking, setSelectedMechanicForBooking] = useState<Mechanic | null>(
    null
  );
  const [selectedMechanicForDetails, setSelectedMechanicForDetails] = useState<Mechanic | null>(
    null
  );

  const brandsList = ['All', 'Yamaha', 'Honda', 'TVS', 'KTM', 'Royal Enfield', 'Tata', 'Hyundai'];
  const servicesList = ['All', 'Electrical & Starter', 'Engine Diagnostics', 'Brake Systems', 'Battery Replacement'];
  const tiersList = ['All', 'Budget', 'Standard', 'Premium'];

  const filteredMechanics = mechanics.filter((m) => {
    // Search text match
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.workshop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase());

    // Brand filter
    const matchesBrand =
      selectedBrand === 'All' || m.specializedBrands.includes(selectedBrand);

    // Service filter
    const matchesService =
      selectedService === 'All' ||
      m.services.some((s) => s.toLowerCase().includes(selectedService.toLowerCase()));

    // Tier filter
    const matchesTier = selectedTier === 'All' || m.priceTier === selectedTier;

    return matchesSearch && matchesBrand && matchesService && matchesTier;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              VERIFIED WORKSHOP NETWORK
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
            Find a Certified Mechanic
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse verified workshops honoring AI-estimated diagnostic price ranges for{' '}
            <strong className="text-white">{activeVehicle.make} {activeVehicle.model}</strong>.
          </p>
        </div>

        {activeDiagnosis && (
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
            <div className="text-xs">
              <span className="text-slate-400 block font-mono">Active AI Diagnostic Target:</span>
              <span className="font-bold text-white font-['Outfit']">
                {activeDiagnosis.probableIssue} (~₹{activeDiagnosis.costEstimate.totalMin.toLocaleString()} - ₹{activeDiagnosis.costEstimate.totalMax.toLocaleString()})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel rounded-2xl p-5 border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search mechanic, garage, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Brand Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Brand:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full md:w-auto px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              {brandsList.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Price Tier */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Tier:</span>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full md:w-auto px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              {tiersList.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-500 md:ml-auto">
            Showing {filteredMechanics.length} garages
          </span>
        </div>
      </div>

      {/* Mechanics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMechanics.map((mech) => (
          <div
            key={mech.id}
            className="glass-panel rounded-2xl p-6 border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition-all group relative overflow-hidden"
          >
            <div className="space-y-4">
              {/* Header: Photo & Name & Rating */}
              <div className="flex items-start gap-3.5">
                <img
                  src={mech.image}
                  alt={mech.name}
                  className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-700 group-hover:ring-cyan-500/50 transition-all shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-white text-base font-['Outfit']">
                      {mech.name}
                    </h3>
                    {mech.verified && (
                      <span title="Verified Workshop">
                        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-medium line-clamp-1">{mech.workshop}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {mech.rating}
                    </span>
                    <span className="text-slate-500">({mech.totalReviews} reviews)</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-cyan-400 font-mono">{mech.distanceKm} km</span>
                  </div>
                </div>
              </div>

              {/* Badges: Specialized Brands */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Specialized Brands:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {mech.specializedBrands.map((brand, bIdx) => (
                    <span
                      key={bIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>

              {/* Services Offered */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Core Services:
                </span>
                <p className="text-xs text-slate-300 line-clamp-1">
                  {mech.services.join(' • ')}
                </p>
              </div>

              {/* Location & Availability */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{mech.location}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{mech.availability}</span>
                </div>
              </div>

              {/* Rates */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Labour Benchmark:</span>
                <span className="font-bold text-white font-mono">₹{mech.estimatedLabourRate}/hr</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-5 mt-5 border-t border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedMechanicForDetails(mech)}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all text-center"
              >
                View Workshop
              </button>
              <button
                onClick={() => setSelectedMechanicForBooking(mech)}
                className="py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all text-center cursor-pointer active:scale-95"
              >
                Request Service
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={Boolean(selectedMechanicForBooking)}
        onClose={() => setSelectedMechanicForBooking(null)}
        mechanic={selectedMechanicForBooking}
      />

      {/* Mechanic Details Drawer/Modal */}
      {selectedMechanicForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0d1424] border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-left space-y-5">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMechanicForDetails.image}
                  alt={selectedMechanicForDetails.name}
                  className="w-14 h-14 rounded-xl object-cover ring-1 ring-cyan-500"
                />
                <div>
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    {selectedMechanicForDetails.name}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedMechanicForDetails.workshop}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMechanicForDetails(null)}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase font-bold text-[10px]">Full Address</span>
                <p className="text-slate-200">{selectedMechanicForDetails.address}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase font-bold text-[10px]">Contact Phone</span>
                <p className="text-cyan-300 font-mono font-bold">{selectedMechanicForDetails.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Experience</span>
                  <span className="text-white font-bold text-sm">
                    {selectedMechanicForDetails.experienceYears} Years Certified
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Service Tier</span>
                  <span className="text-cyan-400 font-bold text-sm">
                    {selectedMechanicForDetails.priceTier} Standard
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedMechanicForDetails(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const m = selectedMechanicForDetails;
                  setSelectedMechanicForDetails(null);
                  setSelectedMechanicForBooking(m);
                }}
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
              >
                Book with this Mechanic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
