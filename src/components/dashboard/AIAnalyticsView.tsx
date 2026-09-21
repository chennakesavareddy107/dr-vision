import React, { useState } from 'react';
import {
  LineChart,
  Award,
  Activity,
  Layers,
  CheckCircle2,
  TrendingUp,
  Cpu,
  BarChart3,
  FileSpreadsheet,
} from 'lucide-react';
import { confusionMatrix, modelEvaluationMetrics, benchmarkDatasets } from '../../data/mockData';

export const AIAnalyticsView: React.FC = () => {
  const [selectedRocClass, setSelectedRocClass] = useState<string>('All Classes (Micro-Avg)');

  const classNames = ['No DR', 'Mild', 'Moderate', 'Severe', 'PDR'];

  const modelComparisons = [
    {
      name: 'DR Vision Hybrid (ConvNeXtV2 + Swin)',
      acc: '98.4%',
      auc: '0.991',
      f1: '0.982',
      latency: '142ms',
      highlight: true,
    },
    {
      name: 'Standalone ConvNeXtV2-Base',
      acc: '95.1%',
      auc: '0.967',
      f1: '0.948',
      latency: '115ms',
      highlight: false,
    },
    {
      name: 'Standalone Swin-Transformer-B',
      acc: '94.6%',
      auc: '0.961',
      f1: '0.941',
      latency: '168ms',
      highlight: false,
    },
    {
      name: 'Vision Transformer (ViT-B/16)',
      acc: '93.8%',
      auc: '0.952',
      f1: '0.934',
      latency: '184ms',
      highlight: false,
    },
    {
      name: 'ResNet-50 (Clinical Baseline)',
      acc: '91.2%',
      auc: '0.924',
      f1: '0.906',
      latency: '92ms',
      highlight: false,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto" id="ai-analytics-view">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-mono border border-blue-200 mb-2">
          <Activity className="w-3.5 h-3.5" />
          <span>Clinical Validation & Multi-Center Benchmarks</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1B3B]">
          Model Performance & Statistical Evaluation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Rigorous quantitative verification across 88,702 multi-ethnic clinical fundus examinations.
        </p>
      </div>

      {/* Top 3 KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Multi-Center Accuracy</span>
          <div className="text-3xl font-serif font-bold text-[#0B1B3B] mt-1 mb-1">
            98.4%
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold font-mono">
            p &lt; 0.001 vs Clinical Ophthalmologist Consensus
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Area Under ROC (AUC)</span>
          <div className="text-3xl font-serif font-bold text-[#0B1B3B] mt-1 mb-1">
            0.991
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold font-mono">
            95% CI: [0.988 - 0.994]
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500">Referable DR Sensitivity</span>
          <div className="text-3xl font-serif font-bold text-[#0B1B3B] mt-1 mb-1">
            99.2%
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold font-mono">
            Near-zero false negative rate on Grades 2–4
          </span>
        </div>
      </div>

      {/* Grid: Confusion Matrix & ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 6 Cols: 5x5 Confusion Matrix */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-serif font-bold text-[#0B1B3B]">
                5×5 Confusion Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Ground truth (rows) vs. AI predicted grade (columns)
              </p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">
              N = 3,500 Test Set
            </span>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto py-2">
            <div className="text-[10px] text-slate-400 font-mono text-center mb-1">
              PREDICTED CLASS →
            </div>
            <div className="flex">
              <div className="text-[10px] text-slate-400 font-mono [writing-mode:vertical-lr] rotate-180 text-center mr-2">
                GROUND TRUTH →
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-6 gap-1 text-[11px] font-mono text-center">
                  <div />
                  {classNames.map((name) => (
                    <div key={name} className="font-bold text-slate-600 py-1">
                      {name}
                    </div>
                  ))}

                  {confusionMatrix.map((row, rowIdx) => (
                    <React.Fragment key={rowIdx}>
                      <div className="font-bold text-slate-600 text-left py-2 pr-1 truncate">
                        {classNames[rowIdx]}
                      </div>
                      {row.map((val, colIdx) => {
                        const isDiagonal = rowIdx === colIdx;
                        const rowTotal = row.reduce((a, b) => a + b, 0);
                        const pct = Math.round((val / rowTotal) * 100);

                        return (
                          <div
                            key={colIdx}
                            className={`p-2 rounded-lg flex flex-col items-center justify-center transition-colors ${
                              isDiagonal
                                ? 'bg-teal-600 text-white font-bold shadow-2xs'
                                : val > 0
                                ? 'bg-rose-50 text-rose-800'
                                : 'bg-slate-50 text-slate-400'
                            }`}
                          >
                            <span className="text-xs">{val}</span>
                            <span className={`text-[9px] ${isDiagonal ? 'text-teal-100' : 'text-slate-400'}`}>
                              {pct}%
                            </span>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Overall Diagnostic Accuracy: <strong className="text-slate-800 font-mono">98.4%</strong></span>
            <span>Cohen's Quadratic Weighted Kappa: <strong className="text-teal-700 font-mono">κ = 0.942</strong></span>
          </div>
        </div>

        {/* Right 6 Cols: Multi-Class ROC Curves */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-serif font-bold text-[#0B1B3B]">
                Receiver Operating Characteristic (ROC)
              </h3>
              <p className="text-xs text-slate-500">
                True Positive Rate vs. False Positive Rate across thresholds
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              AUC = 0.991
            </span>
          </div>

          {/* Simulated High-Res ROC Curve SVG */}
          <div className="relative bg-slate-900 rounded-2xl p-4 text-white">
            <svg viewBox="0 0 400 240" className="w-full h-56">
              {/* Grid lines */}
              <line x1="40" y1="20" x2="40" y2="200" stroke="#334155" strokeWidth="1" />
              <line x1="40" y1="200" x2="380" y2="200" stroke="#334155" strokeWidth="1" />
              <line x1="40" y1="110" x2="380" y2="110" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="210" y1="20" x2="210" y2="200" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

              {/* Diagonal chance line */}
              <line x1="40" y1="200" x2="380" y2="20" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />

              {/* ROC Curve 1: Hybrid ConvNeXtV2 + Swin (Top curve) */}
              <path
                d="M 40 200 C 42 50, 60 25, 380 20"
                fill="none"
                stroke="#14B8A6"
                strokeWidth="3.5"
              />

              {/* ROC Curve 2: Standalone ConvNeXt (Mid curve) */}
              <path
                d="M 40 200 C 50 80, 80 40, 380 20"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeDasharray="3 3"
              />

              {/* Labels */}
              <text x="45" y="195" fill="#94a3b8" fontSize="10" fontFamily="monospace">0.0</text>
              <text x="360" y="215" fill="#94a3b8" fontSize="10" fontFamily="monospace">1.0 FPR</text>
              <text x="15" y="30" fill="#94a3b8" fontSize="10" fontFamily="monospace">1.0</text>
              <text x="8" y="115" fill="#94a3b8" fontSize="10" fontFamily="monospace">0.5 TPR</text>
            </svg>

            {/* Legend */}
            <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-teal-400 rounded-full" />
                <span className="text-teal-300 font-bold">DR Vision Hybrid (AUC 0.991)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-blue-400 rounded-full" />
                <span className="text-blue-300">ResNet-50 Baseline (AUC 0.924)</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            The hybrid architecture achieves near-ideal discrimination in detecting referable DR stages (moderate, severe, and proliferative) at operating thresholds with 99.2% sensitivity.
          </p>
        </div>

      </div>

      {/* Class-wise Precision / Recall / F1 Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-serif font-bold text-[#0B1B3B]">
              Detailed Class-Wise Evaluation Metrics
            </h3>
            <p className="text-xs text-slate-500">
              Harmonic mean and precision breakdown per ETDRS grade
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Validated on EyePACS & Messidor-2 cohorts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                <th className="pb-3 pl-2">Severity Stage</th>
                <th className="pb-3">Precision</th>
                <th className="pb-3">Recall (Sensitivity)</th>
                <th className="pb-3">Specificity</th>
                <th className="pb-3">F1-Score</th>
                <th className="pb-3 text-right pr-2">Class AUC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {modelEvaluationMetrics.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70">
                  <td className="py-3 pl-2 font-sans font-bold text-[#0B1B3B]">
                    {item.grade}
                  </td>
                  <td className="py-3 text-slate-700">{(item.precision * 100).toFixed(1)}%</td>
                  <td className="py-3 text-slate-700">{(item.recall * 100).toFixed(1)}%</td>
                  <td className="py-3 text-slate-700">{(item.specificity * 100).toFixed(1)}%</td>
                  <td className="py-3 font-bold text-teal-700">{(item.f1 * 100).toFixed(1)}%</td>
                  <td className="py-3 text-right pr-2 font-bold text-slate-900">{item.auc.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Architecture Benchmark Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="text-base font-serif font-bold text-[#0B1B3B]">
          Ablation Study & Neural Backbone Comparison
        </h3>
        <p className="text-xs text-slate-500">
          Comparing the dual-stream hybrid against popular computer vision backbones
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="pb-3 pl-2">Model Architecture</th>
                <th className="pb-3">Top-1 Accuracy</th>
                <th className="pb-3">Macro AUC</th>
                <th className="pb-3">Macro F1</th>
                <th className="pb-3 text-right pr-2">Inference Latency (FP16)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modelComparisons.map((m, idx) => (
                <tr
                  key={idx}
                  className={`${m.highlight ? 'bg-teal-50/60 font-bold text-teal-950' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <td className="py-3 pl-2 font-sans">
                    <div className="flex items-center gap-2">
                      {m.highlight && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                      <span>{m.name}</span>
                    </div>
                  </td>
                  <td className="py-3">{m.acc}</td>
                  <td className="py-3">{m.auc}</td>
                  <td className="py-3">{m.f1}</td>
                  <td className="py-3 text-right pr-2">{m.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
