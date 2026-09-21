import React, { useState } from 'react';
import {
  Search,
  Eye,
  CheckSquare,
  Square,
  Info,
  Sliders,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { PredictionResult, LesionDetection } from '../../types';

interface LesionAnalysisViewProps {
  result: PredictionResult;
  onNavigateTab: (tab: any) => void;
}

export const LesionAnalysisView: React.FC<LesionAnalysisViewProps> = ({
  result,
  onNavigateTab,
}) => {
  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>({
    Microaneurysms: true,
    Hemorrhages: true,
    'Hard Exudates': true,
    'Cotton Wool Spots': true,
    Neovascularization: true,
  });

  const toggleLesionType = (type: string) => {
    setActiveToggles((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const lesionCatalog = [
    {
      type: 'Microaneurysms',
      color: '#DC2626',
      badge: 'bg-red-50 text-red-700 border-red-200',
      description: 'Punctate red dots (10–100 μm) from focal capillary wall ballooning and pericyte apoptosis.',
      count: result.lesions.find((l) => l.type === 'Microaneurysms')?.count || 0,
      severity: result.lesions.find((l) => l.type === 'Microaneurysms')?.severityContribution || 0,
    },
    {
      type: 'Hemorrhages',
      color: '#991B1B',
      badge: 'bg-rose-50 text-rose-800 border-rose-200',
      description: 'Flame-shaped (superficial nerve fiber layer) or dot/blot (deep inner nuclear layer) intraretinal bleeding.',
      count: result.lesions.find((l) => l.type === 'Hemorrhages')?.count || 0,
      severity: result.lesions.find((l) => l.type === 'Hemorrhages')?.severityContribution || 0,
    },
    {
      type: 'Hard Exudates',
      color: '#FBBF24',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      description: 'Circinate or scattered yellowish lipid/lipoprotein precipitates from vascular leakage.',
      count: result.lesions.find((l) => l.type === 'Hard Exudates')?.count || 0,
      severity: result.lesions.find((l) => l.type === 'Hard Exudates')?.severityContribution || 0,
    },
    {
      type: 'Cotton Wool Spots',
      color: '#FEF08A',
      badge: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      description: 'Feathery pale ischemic infarcts in the axoplasm of the retinal nerve fiber layer.',
      count: result.lesions.find((l) => l.type === 'Cotton Wool Spots')?.count || 0,
      severity: result.lesions.find((l) => l.type === 'Cotton Wool Spots')?.severityContribution || 0,
    },
    {
      type: 'Neovascularization',
      color: '#B91C1C',
      badge: 'bg-red-100 text-red-900 border-red-300',
      description: 'Abnormal, fragile new capillary networks sprouting on the optic disc (NVD) or along arcade vessels (NVE).',
      count: result.lesions.find((l) => l.type === 'Neovascularization')?.count || 0,
      severity: result.lesions.find((l) => l.type === 'Neovascularization')?.severityContribution || 0,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto" id="lesion-analysis-view">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-mono border border-amber-200 mb-1">
            <Search className="w-3.5 h-3.5" />
            <span>Dedicated Lesion Localization & Quantification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1B3B]">
            Automated Retinal Lesion Detection
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Multi-class bounding highlights and histological contribution metrics for diabetic microvascular anomalies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('grad-cam')}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Switch to Grad-CAM
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Interactive Bounding Highlight Canvas */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col items-center">
            
            {/* Top Toolbar: Active Filters */}
            <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-[#0B1B3B] uppercase font-mono tracking-wider">
                Active Lesion Overlays:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lesionCatalog.map((cat) => {
                  const isActive = activeToggles[cat.type];
                  return (
                    <button
                      key={cat.type}
                      onClick={() => toggleLesionType(cat.type)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isActive
                          ? `${cat.badge} ring-1 ring-slate-400/40`
                          : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Circular Retina with Bounding Overlays */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full overflow-hidden shadow-xl bg-black border-4 border-slate-900 p-1">
              <img
                src={result.imageUrl}
                alt="Retinal Fundus"
                className="w-full h-full object-cover rounded-full"
              />

              {/* Dynamic SVG Bounding Box Overlays */}
              <svg
                viewBox="0 0 500 500"
                className="absolute inset-0 w-full h-full pointer-events-none rounded-full"
              >
                {result.lesions.map((lesion) => {
                  if (!activeToggles[lesion.type]) return null;

                  return (
                    <g key={lesion.id}>
                      {lesion.coordinates.map((coord, idx) => (
                        <g key={idx}>
                          {/* Pulsing indicator circle */}
                          <circle
                            cx={coord.x + coord.width / 2}
                            cy={coord.y + coord.height / 2}
                            r={coord.width + 2}
                            fill="none"
                            stroke={lesion.color}
                            strokeWidth="1.5"
                            strokeDasharray="3 3"
                            className="animate-spin-slow"
                          />
                          {/* Bounding box */}
                          <rect
                            x={coord.x}
                            y={coord.y}
                            width={coord.width}
                            height={coord.height}
                            fill={lesion.color}
                            fillOpacity="0.25"
                            stroke={lesion.color}
                            strokeWidth="2"
                            rx="3"
                          />
                        </g>
                      ))}
                    </g>
                  );
                })}
              </svg>

              {/* Bounding box legend pill */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-700 text-[10px] font-mono text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Bounding highlights active • 500×500 calibrated grid</span>
              </div>
            </div>

            <div className="w-full mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>Patient: {result.patientName}</span>
              <span>Total Lesion Detections: {result.lesions.reduce((acc, l) => acc + l.count, 0)}</span>
            </div>

          </div>

        </div>

        {/* Right 5 Cols: Lesion Count & Quantitative Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quantitative Lesion Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-serif font-bold text-[#0B1B3B]">
                Quantitative Pathology Breakdown
              </h3>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                ETDRS Standard
              </span>
            </div>

            <div className="space-y-4">
              {lesionCatalog.map((item) => (
                <div key={item.type} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-bold text-slate-800">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="font-bold text-[#0B1B3B]">
                        {item.count} detected
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        ({item.severity}% impact)
                      </span>
                    </div>
                  </div>

                  {/* Severity contribution bar */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.severity}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 leading-tight">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Clinical Notes */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-[#0B1B3B] uppercase font-mono tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Ophthalmologist Clinical Findings</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {result.doctorNotes ||
                'Intraretinal microaneurysm clusters detected in both temporal quadrants. No macular edema or foveal avascular zone distortion identified on fundus photography. Microvascular caliber is consistent with Grade 2 Moderate NPDR.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
