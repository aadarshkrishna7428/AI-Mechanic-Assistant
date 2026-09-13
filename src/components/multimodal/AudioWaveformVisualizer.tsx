import React, { useState, useEffect, useRef } from 'react';
import { sampleAudioEvidence } from '../../data/mockData';
import { Mic, MicOff, Play, Square, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';

interface AudioWaveformVisualizerProps {
  onAudioSelected?: (audio: {
    name: string;
    durationSec: number;
    detectedFrequency: string;
    audioPattern: string;
  }) => void;
  selectedAudioId?: string;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({
  onAudioSelected,
  selectedAudioId,
}) => {
  const [activeSample, setActiveSample] = useState(sampleAudioEvidence[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Initialize or update selection
  useEffect(() => {
    if (selectedAudioId) {
      const match = sampleAudioEvidence.find((s) => s.id === selectedAudioId);
      if (match) setActiveSample(match);
    }
  }, [selectedAudioId]);

  // Canvas visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Background subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 30) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();

      // Centerline
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Waveform Bars
      const bars = 48;
      const barWidth = width / bars;
      const data = activeSample.sampleWaveformData;

      for (let i = 0; i < bars; i++) {
        const sampleIdx = i % data.length;
        const baseAmp = (data[sampleIdx] / 100) * (height / 2.3);

        let dynamicAmp = baseAmp;
        if (isPlaying || isRecording) {
          // Add rhythmic modulation
          const modulation = Math.sin(phase + i * 0.4) * (baseAmp * 0.4);
          dynamicAmp = Math.max(4, baseAmp + modulation);
        }

        const x = i * barWidth + 2;
        const barHeight = Math.max(3, dynamicAmp);
        const yTop = height / 2 - barHeight;

        // Gradient color for bars
        const grad = ctx.createLinearGradient(0, yTop, 0, height / 2 + barHeight);
        if (activeSample.id === 'aud-starter') {
          grad.addColorStop(0, '#38bdf8');
          grad.addColorStop(0.5, '#06b6d4');
          grad.addColorStop(1, '#0891b2');
        } else if (activeSample.id === 'aud-rodknock') {
          grad.addColorStop(0, '#f87171');
          grad.addColorStop(0.5, '#ef4444');
          grad.addColorStop(1, '#991b1b');
        } else {
          grad.addColorStop(0, '#fbbf24');
          grad.addColorStop(0.5, '#f59e0b');
          grad.addColorStop(1, '#b45309');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x, yTop, Math.max(2, barWidth - 4), barHeight * 2);
      }

      phase += (isPlaying || isRecording) ? 0.15 : 0.03;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeSample, isPlaying, isRecording]);

  // Audio synthesis for realistic sound feedback
  const togglePlayAudio = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      playSyntheticAudio();
    }
  };

  const playSyntheticAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Configure based on sample
      if (activeSample.id === 'aud-starter') {
        // Rapid clicks (18 Hz square burst)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
      } else if (activeSample.id === 'aud-rodknock') {
        // Low knock
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(85, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
      } else {
        // Belt squeal
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2200, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscillatorRef.current = osc;
      setIsPlaying(true);

      // Auto stop after duration
      setTimeout(() => {
        stopAudio();
      }, activeSample.duration * 1000);
    } catch (e) {
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
    }
    setIsPlaying(false);
  };

  const handleSelectSample = (sample: typeof sampleAudioEvidence[0]) => {
    stopAudio();
    setActiveSample(sample);
    if (onAudioSelected) {
      onAudioSelected({
        name: sample.title,
        durationSec: sample.duration,
        detectedFrequency: sample.id === 'aud-starter' ? '18.4 Hz' : '110 Hz',
        audioPattern: sample.detectedPattern,
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecordTimer(0);
      handleSelectSample(sampleAudioEvidence[0]);
    } else {
      setIsRecording(true);
      let count = 0;
      const interval = setInterval(() => {
        count += 1;
        setRecordTimer(count);
        if (count >= 5) {
          clearInterval(interval);
          setIsRecording(false);
          setRecordTimer(0);
          handleSelectSample(sampleAudioEvidence[0]);
        }
      }, 1000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Waveform Canvas Monitor */}
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isPlaying || isRecording
                  ? 'bg-cyan-400 animate-ping'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-xs font-mono font-bold text-slate-200">
              ACOUSTIC FREQUENCY SPECTRUM
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Pattern: <strong className="text-cyan-400">{activeSample.detectedPattern}</strong></span>
          </div>
        </div>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          width={580}
          height={110}
          className="w-full h-28 rounded-lg bg-[#070b12]"
        />

        {/* Audio Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlayAudio}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
              }`}
            >
              {isPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Stop Audio' : 'Play Engine Sound'}</span>
            </button>

            <button
              type="button"
              onClick={toggleRecording}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isRecording ? `Recording... (${recordTimer}s)` : 'Record Engine Audio'}</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            Duration: {activeSample.duration}s
          </span>
        </div>
      </div>

      {/* Preset Automotive Audio Samples */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 block">
          Select Mechanical Sound Profile to Analyze:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sampleAudioEvidence.map((sample) => {
            const isSelected = sample.id === activeSample.id;
            return (
              <button
                type="button"
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-2.5 rounded-xl text-left transition-all border flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold font-['Outfit']">{sample.title}</span>
                    {sample.id === 'aud-starter' && (
                      <span className="text-[9px] font-bold px-1.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Primary Demo
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{sample.description}</p>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
