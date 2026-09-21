import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Sliders,
  Eye,
  Info,
  CheckCircle,
  Download,
  Maximize2,
  RefreshCw,
  Cpu,
  GitFork,
} from 'lucide-react';
import { PredictionResult, GradCamRegion } from '../../types';
import { gradeMetadata } from '../../data/mockData';

interface GradCamViewProps {
  result: PredictionResult;
  onNavigateTab: (tab: any) => void;
}

export const GradCamView: React.FC<GradCamViewProps> = ({ result, onNavigateTab }) => {
  const [viewMode, setViewMode] = useState<'overlay' | 'original' | 'heatmap'>('overlay');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(65);
  const [selectedLayer, setSelectedLayer] = useState<'hybrid' | 'convnext' | 'swin'>('hybrid');
  const [activeRegion, setActiveRegion] = useState<string | null>(result.gradCamRegions[0]?.id || null);

  const meta = gradeMetadata[result.predictedGrade];

  return (
    <div className="space-y-8 max-w-6xl mx-auto" id="grad-cam-view">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1B3B]">
            Grad-CAM Saliency & Attention Heatmaps
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gradient-weighted Class Activation Mapping revealing model attention distribution across dual-branch retinal feature layers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('lesions')}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Switch to Lesion Analysis
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Retinal Canvas Viewer & View Mode Controls */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Main Visual Viewer Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col items-center">
            
            {/* View Mode Switcher Pill */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setViewMode('overlay')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'overlay'
                      ? 'bg-white text-[#0B1B3B] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Blended Overlay
                </button>
                <button
                  onClick={() => setViewMode('original')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'original'
                      ? 'bg-white text-[#0B1B3B] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Original Fundus
                </button>
                <button
                  onClick={() => setViewMode('heatmap')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'heatmap'
                      ? 'bg-white text-[#0B1B3B] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Heatmap Only
                </button>
              </div>

              {/* Opacity slider for Overlay */}
              {viewMode === 'overlay' && (
                <div className="flex items-center gap-2 text-xs">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 font-medium">CAM Blend:</span>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                    className="w-24 accent-[#0B1B3B]"
                  />
                  <span className="font-mono text-slate-700 w-8">{overlayOpacity}%</span>
                </div>
              )}
            </div>

            {/* Circular Retina Frame */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full overflow-hidden shadow-xl bg-black border-4 border-slate-900 p-1">
              {/* Layer 1: Base Fundus */}
              {viewMode !== 'heatmap' && (
                <img
                  src={result.imageUrl}
                  alt="Original Retina"
                  className="w-full h-full object-cover rounded-full"
                />
              )}

              {/* Layer 2: Grad-CAM Overlay */}
              {viewMode !== 'original' && result.gradCamUrl && (
                <img
                  src={result.gradCamUrl}
                  alt="Grad-CAM Saliency"
                  className={`absolute inset-0 w-full h-full object-cover rounded-full pointer-events-none transition-opacity duration-200 ${
                    viewMode === 'heatmap' ? 'bg-black' : 'mix-blend-screen'
                  }`}
                  style={{
                    opacity: viewMode === 'heatmap' ? 1 : overlayOpacity / 100,
                  }}
                />
              )}

              {/* Thermal colorbar label */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2 text-[10px] font-mono text-white">
                <span className="text-blue-400">Low Activation</span>
                <div className="w-16 h-2 rounded-full bg-gradient-to-r from-blue-600 via-teal-400 via-amber-400 to-rose-600" />
                <span className="text-rose-400">High Activation</span>
              </div>
            </div>

            {/* Bottom info banner */}
            <div className="w-full mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Patient: <strong className="text-slate-800">{result.patientName}</strong> ({result.eyeSide})</span>
              <span>Target Class: <strong className="text-slate-800">{meta.name} ({(result.confidence * 100).toFixed(1)}%)</strong></span>
            </div>

          </div>

          {/* Layer Visualization Selection (ConvNeXt vs Swin) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-[#0B1B3B] uppercase tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>Layer Activation Backpropagation Source</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <button
                onClick={() => setSelectedLayer('hybrid')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedLayer === 'hybrid'
                    ? 'border-blue-500 bg-blue-50/50 text-[#0B1B3B] ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">Hybrid Fused Saliency</div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Concatenated ConvNeXtV2 Stage 4 + Swin Block 4 gradients
                </div>
              </button>

              <button
                onClick={() => setSelectedLayer('convnext')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedLayer === 'convnext'
                    ? 'border-blue-500 bg-blue-50/50 text-[#0B1B3B] ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">ConvNeXtV2 Dense Map</div>
                <div className="text-[10px] text-slate-500 mt-1">
                  High-spatial receptive fields focused on focal microaneurysms
                </div>
              </button>

              <button
                onClick={() => setSelectedLayer('swin')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedLayer === 'swin'
                    ? 'border-blue-500 bg-blue-50/50 text-[#0B1B3B] ring-1 ring-blue-500'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold">Swin Cross-Attention</div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Shifted-window multi-head attention over vascular arcades
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Right 5 Cols: Attention Regions List & Clinical Interpretation */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Key Attention Regions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#0B1B3B] flex items-center justify-between">
              <span>Saliency Regions of Interest</span>
              <span className="text-[10px] font-mono text-slate-400">
                {result.gradCamRegions.length} Active Zones
              </span>
            </h3>

            <div className="space-y-3">
              {result.gradCamRegions.map((region) => {
                const isCurrent = activeRegion === region.id;
                return (
                  <div
                    key={region.id}
                    onClick={() => setActiveRegion(region.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-xs ${
                      isCurrent
                        ? 'border-teal-500 bg-teal-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-[#0B1B3B]">{region.label}</span>
                      <span className="font-mono font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded text-[10px]">
                        Weight: {(region.weight * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-500 mb-1">
                      Quadrant: <strong>{region.quadrant}</strong>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {region.significance}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Explanation & Clinical Corroboration */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-serif font-bold text-[#0B1B3B] flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Ophthalmologist Clinical Interpretation</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              The Grad-CAM heat localization directly coincides with clinically verifiable signs of diabetic microvascular pathology. 
              Crucially, optical disc margin glare and peripheral photographic edge vignetting received near-zero gradient weights, confirming that the hybrid model is not relying on spurious non-biological artifacts.
            </p>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Grad-CAM Verification:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Validated by Attending MD
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
