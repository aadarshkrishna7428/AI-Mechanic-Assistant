import React, { useState } from 'react';
import { sampleImageEvidence } from '../../data/mockData';
import { Camera, Upload, CheckCircle2, AlertTriangle, Eye, Sparkles } from 'lucide-react';

interface ImageInspectionToolProps {
  onImageSelected?: (image: {
    name: string;
    previewUrl: string;
    category: string;
  }) => void;
  selectedImageId?: string;
}

export const ImageInspectionTool: React.FC<ImageInspectionToolProps> = ({
  onImageSelected,
  selectedImageId,
}) => {
  const [activeSample, setActiveSample] = useState(sampleImageEvidence[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customName, setCustomName] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setCustomImage(url);
      setCustomName(file.name);
      if (onImageSelected) {
        onImageSelected({
          name: file.name,
          previewUrl: url,
          category: 'Uploaded Component Image',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (sample: typeof sampleImageEvidence[0]) => {
    setCustomImage(null);
    setActiveSample(sample);
    if (onImageSelected) {
      onImageSelected({
        name: sample.title,
        previewUrl: sample.url,
        category: sample.category,
      });
    }
  };

  const displayUrl = customImage || activeSample.url;
  const displayLabel = customImage
    ? `Custom Inspection: ${customName} (Analyzing component contours)`
    : activeSample.detectionLabel;
  const displayConf = customImage ? 85 : activeSample.confidencePct;

  return (
    <div className="space-y-4">
      {/* Image Inspection Viewport with Computer Vision Bounding Box */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-2">
        <div className="relative h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
          <img
            src={displayUrl}
            alt="Inspection Subject"
            className="w-full h-full object-cover opacity-85"
          />

          {/* Computer Vision Overlay Grid */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 pointer-events-none" />

          {/* Dynamic Bounding Box (AI Object Detection Simulation) */}
          {!customImage && activeSample.boundingBox && (
            <div
              style={{
                top: `${activeSample.boundingBox.top}%`,
                left: `${activeSample.boundingBox.left}%`,
                width: `${activeSample.boundingBox.width}%`,
                height: `${activeSample.boundingBox.height}%`,
              }}
              className="absolute border-2 border-cyan-400 rounded-md bg-cyan-500/10 pointer-events-none animate-pulse"
            >
              {/* Corner brackets */}
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-300" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-300" />
              <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-300" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-300" />

              {/* Tag */}
              <div className="absolute -top-6 left-0 bg-cyan-500 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                DEFECT DETECTED • {activeSample.confidencePct}% CONFIDENCE
              </div>
            </div>
          )}

          {/* Bottom Telemetry HUD */}
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase">
                  VISION INFERENCE ENGINE
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {displayConf}% CONFIDENCE
              </span>
            </div>
            <p className="text-xs font-semibold text-white truncate">{displayLabel}</p>
          </div>
        </div>
      </div>

      {/* Upload Custom Image Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-800 text-cyan-400">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white">Upload Your Vehicle Component Photo</p>
            <p className="text-[10px] text-slate-400">Supports JPG, PNG (Tyre, rotor, battery, leak)</p>
          </div>
        </div>

        <label className="cursor-pointer px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-all">
          <span>Browse File</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Preset Visual Samples */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 block">
          Or Select Demo Inspection Target:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {sampleImageEvidence.map((sample) => {
            const isSelected = !customImage && sample.id === activeSample.id;
            return (
              <button
                type="button"
                key={sample.id}
                onClick={() => handleSelectPreset(sample)}
                className={`p-2 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/50 border-cyan-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <img
                  src={sample.url}
                  alt={sample.title}
                  className="w-full h-16 rounded-lg object-cover mb-1.5"
                />
                <span className="text-[11px] font-bold font-['Outfit'] block truncate">
                  {sample.title}
                </span>
                <span className="text-[9px] text-slate-400 block truncate">{sample.category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
