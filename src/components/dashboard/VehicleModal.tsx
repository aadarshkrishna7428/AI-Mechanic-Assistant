import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vehicle } from '../../types';
import { X, Car, Plus, CheckCircle2, Shield, Sparkles } from 'lucide-react';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({ isOpen, onClose }) => {
  const { vehicles, activeVehicle, setActiveVehicle, addVehicle } = useApp();
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2023);
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'>('Petrol');
  const [mileage, setMileage] = useState(15000);
  const [plateNumber, setPlateNumber] = useState('');
  const [engineType, setEngineType] = useState('');
  const [type, setType] = useState<'Bike' | 'Car'>('Bike');

  if (!isOpen) return null;

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make || !model || !plateNumber) return;

    addVehicle({
      make,
      model,
      year: Number(year),
      fuelType,
      mileage: Number(mileage),
      plateNumber: plateNumber.toUpperCase(),
      engineType: engineType || `${year} OEM Engine`,
      lastServiceDate: 'Just now',
      nextServiceKm: 3000,
      image:
        type === 'Bike'
          ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&auto=format&fit=crop&q=80',
      type,
    });

    setIsAddingNew(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d1424] border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-left space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                {isAddingNew ? 'Register New Vehicle' : 'Select Active Vehicle'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAddingNew
                  ? 'Add your vehicle details for AI diagnostic calibration'
                  : 'Switch between vehicles in your digital garage'}
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

        {!isAddingNew ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vehicles.map((veh) => {
                const isSelected = veh.id === activeVehicle.id;
                return (
                  <div
                    key={veh.id}
                    onClick={() => {
                      setActiveVehicle(veh);
                      onClose();
                    }}
                    className={`relative p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    )}

                    <div className="flex items-start gap-3">
                      <img
                        src={veh.image}
                        alt={veh.model}
                        className="w-16 h-16 rounded-lg object-cover ring-1 ring-slate-700"
                      />
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-sm font-['Outfit']">
                          {veh.make} {veh.model}
                        </h4>
                        <p className="text-xs text-cyan-300 font-mono font-medium">
                          {veh.plateNumber}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                          <span>{veh.year}</span>
                          <span>•</span>
                          <span>{veh.fuelType}</span>
                          <span>•</span>
                          <span>{veh.mileage.toLocaleString()} km</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full py-3 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all bg-slate-900/40 hover:bg-cyan-500/5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Vehicle to Garage</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitNew} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Vehicle Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('Bike')}
                    className={`py-2 text-xs font-semibold rounded-lg border ${
                      type === 'Bike'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Motorcycle / Scooter
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('Car')}
                    className={`py-2 text-xs font-semibold rounded-lg border ${
                      type === 'Car'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    Car / SUV
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  License Plate Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KA 03 HY 8492"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono uppercase focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Brand / Make *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yamaha, Honda, Tata"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Model Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MT-15, Classic 350, Nexon"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Manufacturing Year
                </label>
                <input
                  type="number"
                  min="2000"
                  max="2026"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fuel Type
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current Odometer (km)
                </label>
                <input
                  type="number"
                  min="0"
                  value={mileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Engine / Battery Spec
                </label>
                <input
                  type="text"
                  placeholder="e.g. 155cc Liquid-cooled 4V"
                  value={engineType}
                  onChange={(e) => setEngineType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
              >
                Back to List
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
              >
                Save & Select Vehicle
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
