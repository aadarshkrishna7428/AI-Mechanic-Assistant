import React from 'react';
import { X, Camera, Sparkles, ArrowRight } from 'lucide-react';
import { ImageInspectionTool } from './ImageInspectionTool';
import { useApp } from '../../context/AppContext';

interface ImageDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageDiagnosisModal: React.FC<ImageDiagnosisModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentView } = useApp();

  if (!isOpen) return null;

  const handleProceedToDiagnosis = () => {
    onClose();
    setCurrentView('diagnose');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0d1424] border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-left space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Outfit']">
                AI Computer Vision Inspection
              </h3>
              <p className="text-xs text-slate-400">
                Identify mechanical wear, crack patterns, and diagnostic trouble lights
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

        <ImageInspectionTool />

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
          >
            Close
          </button>
          <button
            onClick={handleProceedToDiagnosis}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
          >
            <span>Attach to Full AI Diagnosis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
