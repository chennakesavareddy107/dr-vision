import React, { useState } from 'react';
import {
  Eye,
  Sliders,
  Layers,
  ArrowRight,
  Download,
  Info,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { SitePage, DRGrade } from '../types';
import { generateFundusSvg } from '../data/retinalAssets';
import { gradeMetadata, samplePredictions } from '../data/mockData';

interface GradCamPageProps {
  onNavigatePage: (page: SitePage) => void;
  onLaunchDemo: () => void;
}

export const GradCamPage: React.FC<GradCamPageProps> = ({
  onNavigatePage,
  onLaunchDemo,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<DRGrade>(2);
  const [opacity, setOpacity] = useState(70);
  const [colormap, setColormap] = useState<'jet' | 'turbo' | 'inferno'>('jet');
  const [viewMode, setViewMode] = useState<'sideBySide' | 'overlay' | 'split'>('sideBySide');
  const [showLesionBoxes, setShowLesionBoxes] = useState(true);

  const activePrediction = samplePredictions.find((p) => p.predictedGrade === selectedGrade) || samplePredictions[0];
  const info = gradeMetadata[selectedGrade];

  const originalFundus = activePrediction.imageUrl;
  const gradCamOverlay = generateFundusSvg(selectedGrade, true);

  return (
    <div className="w-full bg-[#F8FAFC] text-[#0F172A] py-10" id="grad-cam-page-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Title Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold tracking-[0.25em] text-blue-600 uppercase font-mono">
              EXPLAINABLE AI (XAI)
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0B1B3B] mb-3">
            Grad-CAM Visual Explanations
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Gradient-weighted Class Activation Mapping (Grad-CAM) illuminates the specific retinal microvascular lesions and features driving the model’s severity classification.
          </p>
        </div>

        {/* Grade Selector Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {([0, 1, 2, 3, 4] as DRGrade[]).map((g) => {
            const isSelected = selectedGrade === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#0B1B3B] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: gradeMetadata[g].color }}
                />
                <span>Grade {g}: {gradeMetadata[g].name}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Viewer & Controls Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Display Mode:</span>
              <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
                <button
                  onClick={() => setViewMode('sideBySide')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                    viewMode === 'sideBySide' ? 'bg-white shadow-xs text-blue-600 font-bold' : 'text-slate-600'
                  }`}
                >
                  Side-by-Side
                </button>
                <button
                  onClick={() => setViewMode('overlay')}
                  className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                    viewMode === 'overlay' ? 'bg-white shadow-xs text-blue-600 font-bold' : 'text-slate-600'
                  }`}
                >
                  Single Overlay
                </button>
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">Heatmap Intensity:</span>
              <input
                type="range"
                min="10"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-28 sm:w-36 accent-blue-600 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-600 w-9">{opacity}%</span>
            </div>

            {/* Toggle Lesion annotations */}
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showLesionBoxes}
                onChange={(e) => setShowLesionBoxes(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Highlight Lesion Coordinates</span>
            </label>
          </div>

          {/* Visual Display Viewport */}
          <div className="bg-[#090D16] rounded-2xl p-6 sm:p-8 flex items-center justify-center min-h-[380px] shadow-inner">
            
            {viewMode === 'sideBySide' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Original Fundus */}
                <div className="flex flex-col items-center">
                  <div className="relative w-60 h-60 sm:w-72 sm:h-72 rounded-full overflow-hidden bg-black ring-2 ring-slate-800 shadow-2xl">
                    <img
                      src={originalFundus}
                      alt="Original Retinal Fundus"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-3 text-xs font-semibold text-slate-300">
                    Original Color Fundus Scan (Macula Centered)
                  </div>
                </div>

                {/* Grad-CAM Overlaid Fundus */}
                <div className="flex flex-col items-center">
                  <div className="relative w-60 h-60 sm:w-72 sm:h-72 rounded-full overflow-hidden bg-black ring-2 ring-amber-500/80 shadow-2xl">
                    <img
                      src={originalFundus}
                      alt="Base Fundus"
                      className="w-full h-full object-cover"
                    />
                    <img
                      src={gradCamOverlay}
                      alt="Grad-CAM Thermal Heatmap"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-screen"
                      style={{ opacity: opacity / 100 }}
                    />
                    {showLesionBoxes && activePrediction.lesions.map((lesion, idx) => (
                      <div
                        key={idx}
                        className="absolute border border-amber-400/90 rounded-sm bg-amber-400/15 pointer-events-none"
                        style={{
                          left: `${45 + (idx * 12)}%`,
                          top: `${40 + (idx * 8)}%`,
                          width: '18px',
                          height: '18px',
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-3 text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Grad-CAM Activation (ConvNeXtV2 Stage 4 + Swin Attention)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-72 h-72 sm:w-84 sm:h-84 rounded-full overflow-hidden bg-black ring-4 ring-blue-500 shadow-2xl">
                <img
                  src={originalFundus}
                  alt="Base Fundus"
                  className="w-full h-full object-cover"
                />
                <img
                  src={gradCamOverlay}
                  alt="Grad-CAM Overlay"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
                  style={{ opacity: opacity / 100 }}
                />
              </div>
            )}

          </div>

          {/* Clinical Insights Below Viewport */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-500 font-mono mb-1">Target Classification</div>
              <div className="text-lg font-serif font-bold text-slate-900">{info.fullName}</div>
              <div className="text-xs text-slate-600 mt-1">{info.clinicalCriteria}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-xs text-slate-500 font-mono mb-1">Heatmap Peak Quadrants</div>
              <div className="text-lg font-serif font-bold text-amber-700">Superior Temporal & Macular</div>
              <div className="text-xs text-slate-600 mt-1">High attention gradient around intraretinal microvascular abnormalities (IRMA).</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-500 font-mono mb-1">Model Verification</div>
                <div className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Clinically Concordant</span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Model focuses on diagnostic pathological lesions rather than optic disc or image background artifacts.
                </div>
              </div>

              <button
                onClick={() => onNavigatePage('prediction')}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                <span>Analyze Custom Image in Prediction</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
