import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { runAIDiagnosis } from '../../data/diagnosisEngine';
import { DiagnosisResultView } from './DiagnosisResultView';
import { AudioWaveformVisualizer } from '../multimodal/AudioWaveformVisualizer';
import { ImageInspectionTool } from '../multimodal/ImageInspectionTool';
import {
  Sparkles,
  Car,
  FileText,
  Clock,
  AlertTriangle,
  Upload,
  Mic,
  Camera,
  Activity,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Wrench,
  Cpu,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface AIDiagnosisPageProps {
  onOpenVehicleModal: () => void;
}

export const AIDiagnosisPage: React.FC<AIDiagnosisPageProps> = ({ onOpenVehicleModal }) => {
  const {
    activeVehicle,
    activeDiagnosis,
    setActiveDiagnosis,
    setCurrentView,
  } = useApp();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [problemDescription, setProblemDescription] = useState<string>(
    'My bike makes a clicking sound when I try to start it.'
  );
  const [onset, setOnset] = useState<string>('today');
  const [frequency, setFrequency] = useState<string>('always');
  const [warningLights, setWarningLights] = useState<string[]>(['Battery / Charging']);
  const [performanceChanges, setPerformanceChanges] = useState<string[]>([
    'Difficulty starting / No crank',
  ]);
  const [activeEvidenceTab, setActiveEvidenceTab] = useState<'text' | 'image' | 'audio'>('audio');

  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const [recordedAudio, setRecordedAudio] = useState<any>({
    name: 'Clicking Solenoid / Weak Battery',
    durationSec: 4.2,
    detectedFrequency: '18.4 Hz',
    audioPattern: 'Clicking / Repeated metallic relay engagement',
  });

  // Loading animation state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scanStepIndex, setScanStepIndex] = useState<number>(0);
  const [scanProgress, setScanProgress] = useState<number>(0);

  const scanSteps = [
    'Parsing natural language vehicle symptom tokens...',
    'Analyzing multimodal engine acoustic waveform & resonance band...',
    'Correlating telemetry with Yamaha MT-15 knowledge graph...',
    'Evaluating probabilistic Bayesian failure hypotheses...',
    'Synthesizing Explainable AI reasoning and localized repair pricing...',
  ];

  const symptomPresets = [
    {
      label: 'Primary Demo: Starting Clicking Noise',
      text: 'My bike makes a clicking sound when I try to start it.',
      lights: ['Battery / Charging'],
      perf: ['Difficulty starting / No crank'],
      evidence: 'audio',
    },
    {
      label: 'Brake Squeal & Scraping',
      text: 'Loud high-pitched squealing whenever front brake lever is pressed.',
      lights: ['ABS'],
      perf: ['Reduced braking bite'],
      evidence: 'image',
    },
    {
      label: 'Engine Overheating in Traffic',
      text: 'Engine temperature indicator in red zone and radiator fan screaming in stop-and-go traffic.',
      lights: ['Check Engine', 'High Coolant Temp'],
      perf: ['Excessive engine heat'],
      evidence: 'text',
    },
  ];

  const handleSelectPreset = (preset: typeof symptomPresets[0]) => {
    setProblemDescription(preset.text);
    setWarningLights(preset.lights);
    setPerformanceChanges(preset.perf);
    setActiveEvidenceTab(preset.evidence as any);
  };

  const toggleWarningLight = (light: string) => {
    if (warningLights.includes(light)) {
      setWarningLights(warningLights.filter((l) => l !== light));
    } else {
      setWarningLights([...warningLights, light]);
    }
  };

  const togglePerformanceChange = (change: string) => {
    if (performanceChanges.includes(change)) {
      setPerformanceChanges(performanceChanges.filter((c) => c !== change));
    } else {
      setPerformanceChanges([...performanceChanges, change]);
    }
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setScanStepIndex(0);
    setScanProgress(15);

    const stepInterval = setInterval(() => {
      setScanStepIndex((prev) => {
        if (prev < scanSteps.length - 1) {
          setScanProgress((p) => Math.min(95, p + 20));
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    setTimeout(() => {
      clearInterval(stepInterval);
      setScanProgress(100);

      const result = runAIDiagnosis(
        {
          vehicleId: activeVehicle.id,
          problemDescription,
          onset,
          frequency,
          mileageAtDiagnosis: activeVehicle.mileage,
          warningLights,
          performanceChanges,
          evidenceType: activeEvidenceTab === 'audio' ? 'multimodal' : activeEvidenceTab,
          uploadedImage,
          recordedAudio: activeEvidenceTab === 'audio' ? recordedAudio : undefined,
        },
        activeVehicle
      );

      setActiveDiagnosis(result);
      setIsAnalyzing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 3200);
  };

  // If a diagnosis result is already active and user is not in the middle of re-editing, show result view
  if (activeDiagnosis && !isAnalyzing) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DiagnosisResultView
          diagnosis={activeDiagnosis}
          vehicle={activeVehicle}
          onFindMechanic={() => setCurrentView('mechanics')}
          onRediagnose={() => setActiveDiagnosis(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            MULTIMODAL DIAGNOSTIC STUDIO
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
          AI Vehicle Diagnosis
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Feed symptoms, sounds, and visual damage into our specialized automotive inference engine for instant explainable diagnostics.
        </p>
      </div>

      {/* AI Analysis Loading State Modal */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#09101d] border border-cyan-500/40 p-8 text-center space-y-6 shadow-2xl shadow-cyan-500/20 relative overflow-hidden">
            {/* Top scanning line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

            {/* Radar Sweep Animation */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-30" />
              <div className="absolute inset-2 rounded-full border border-cyan-500/40 animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/50 shadow-inner">
                <Cpu className="w-10 h-10 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                INFERENCE IN PROGRESS • {scanProgress}%
              </span>
              <h3 className="text-xl font-bold text-white font-['Outfit']">
                Analyzing Vehicle Symptoms
              </h3>
              <p className="text-xs text-slate-400 font-mono h-8 flex items-center justify-center transition-all">
                {scanSteps[scanStepIndex]}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className="bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>

            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              Vehicle Target: {activeVehicle.make} {activeVehicle.model} ({activeVehicle.engineType})
            </div>
          </div>
        </div>
      )}

      {/* 4-Step Interactive Diagnostic Wizard */}
      <div className="space-y-8">
        {/* Step 1 — Select Vehicle */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs">
                01
              </span>
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Select Vehicle for Diagnosis
                </h3>
                <p className="text-xs text-slate-400">
                  Engine calibration and knowledge graph will adapt to this specific model
                </p>
              </div>
            </div>

            <button
              onClick={onOpenVehicleModal}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Change Vehicle
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={activeVehicle.image}
                alt={activeVehicle.model}
                className="w-14 h-14 rounded-xl object-cover ring-1 ring-cyan-500/30"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base font-['Outfit']">
                    {activeVehicle.make} {activeVehicle.model}
                  </span>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {activeVehicle.year}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Plate: {activeVehicle.plateNumber} • {activeVehicle.mileage.toLocaleString()} km • {activeVehicle.fuelType}
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Calibrated
            </span>
          </div>
        </div>

        {/* Step 2 — Describe the Problem */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs">
              02
            </span>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Describe the Problem
              </h3>
              <p className="text-xs text-slate-400">
                Explain in your own natural words what you hear, feel, or observe
              </p>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">
              Quick Test Scenarios (Click to auto-populate):
            </span>
            <div className="flex flex-wrap gap-2">
              {symptomPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-all text-left"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Large Textarea */}
          <div>
            <textarea
              rows={4}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Describe what is happening with your vehicle... (e.g. My bike makes a clicking sound when I try to start it.)"
              className="w-full p-4 rounded-xl bg-slate-950/90 border border-slate-800 focus:border-cyan-500 text-white text-sm focus:outline-none transition-colors leading-relaxed placeholder:text-slate-600 font-sans"
            />
          </div>
        </div>

        {/* Step 3 — Additional Information */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs">
              03
            </span>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Additional Diagnostic Context
              </h3>
              <p className="text-xs text-slate-400">
                Provide timing, frequency, and instrument cluster telemetry
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Onset */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                When did the problem start?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'today', label: 'Today' },
                  { id: 'few-days', label: 'Past few days' },
                  { id: 'week', label: 'A week ago' },
                  { id: 'month', label: 'Ongoing (> 1 mo)' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setOnset(item.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      onset === item.id
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Does it happen always or sometimes?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'always', label: 'Always' },
                  { id: 'cold-start', label: 'Cold mornings only' },
                  { id: 'sometimes', label: 'Sometimes / Intermittent' },
                  { id: 'under-load', label: 'Under heavy throttle' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setFrequency(item.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      frequency === item.id
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Warning Lights */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Warning Light Present on Dashboard?
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Battery / Charging',
                'Check Engine (MIL)',
                'ABS Warning',
                'Low Oil Pressure',
                'High Coolant Temp',
                'None',
              ].map((light) => {
                const isSelected = warningLights.includes(light);
                return (
                  <button
                    type="button"
                    key={light}
                    onClick={() => toggleWarningLight(light)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {light}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Performance Changes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Vehicle Performance Changes:
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Difficulty starting / No crank',
                'Reduced pickup / acceleration',
                'Engine stalling at signals',
                'Rough vibration / jitter',
                'Fuel efficiency dropped',
              ].map((perf) => {
                const isSelected = performanceChanges.includes(perf);
                return (
                  <button
                    type="button"
                    key={perf}
                    onClick={() => togglePerformanceChange(perf)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {perf}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step 4 — Upload Evidence (Multimodal Options) */}
        <div className="glass-panel rounded-2xl p-6 border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs">
                04
              </span>
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">
                  Upload Evidence (Multimodal AI)
                </h3>
                <p className="text-xs text-slate-400">
                  AI correlates text with acoustic frequencies and computer vision
                </p>
              </div>
            </div>

            {/* Evidence Tabs */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveEvidenceTab('audio')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeEvidenceTab === 'audio'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Engine Audio</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEvidenceTab('image')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeEvidenceTab === 'image'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Image</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveEvidenceTab('text')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeEvidenceTab === 'text'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Text Only</span>
              </button>
            </div>
          </div>

          {/* Active Tab View */}
          {activeEvidenceTab === 'audio' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200 leading-relaxed">
                <span className="font-bold">Acoustic Signal Engine:</span> Record the sound of your engine starter or choose a simulated recording. The AI extracts harmonic resonance and mechanical impact frequency.
              </div>
              <AudioWaveformVisualizer
                onAudioSelected={(audio) => setRecordedAudio(audio)}
              />
            </div>
          )}

          {activeEvidenceTab === 'image' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-200 leading-relaxed">
                <span className="font-bold">Computer Vision Inspection:</span> Upload a photo of your brake pad, tyre tread, battery terminal, or dashboard indicator for automated defect bounding box analysis.
              </div>
              <ImageInspectionTool
                onImageSelected={(image) => setUploadedImage(image)}
              />
            </div>
          )}

          {activeEvidenceTab === 'text' && (
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-cyan-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Symptom Tokens Calibrated</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                The AI will use your natural language problem description along with vehicle age and mileage telemetry to perform inference.
              </p>
            </div>
          )}
        </div>

        {/* Big Submit Button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleStartAnalysis}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-base sm:text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 flex items-center justify-center gap-3 transition-all cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
          >
            <Sparkles className="w-6 h-6 text-slate-950" />
            <span>Analyze with AI</span>
            <ChevronRight className="w-5 h-5 text-slate-950" />
          </button>
          <p className="text-center text-[11px] text-slate-500 mt-2">
            Multimodal Bayesian Diagnostic Inference Engine • Instant XAI Explanation & ₹ Cost Range
          </p>
        </div>
      </div>
    </div>
  );
};
