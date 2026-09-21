import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Layers,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  FileCheck2
} from 'lucide-react';
import { SitePage } from '../types';

interface PerformancePageProps {
  onNavigatePage: (page: SitePage) => void;
  onLaunchDemo: () => void;
}

export const PerformancePage: React.FC<PerformancePageProps> = ({
  onNavigatePage,
  onLaunchDemo,
}) => {
  const metrics = [
    { label: 'Overall AUROC', value: '0.984', detail: 'Area Under Receiver Operating Characteristic Curve' },
    { label: 'Referable Sensitivity', value: '97.2%', detail: 'Grade ≥ 2 (Moderate, Severe, PDR)' },
    { label: 'Clinical Specificity', value: '98.1%', detail: 'True Negative Rate on Normal Retinas' },
    { label: 'Quadratic Kappa (κ)', value: '0.942', detail: 'Inter-grader agreement with retina specialists' },
  ];

  const benchmarks = [
    { model: 'ResNet-50 (Baseline)', auroc: '0.921', kappa: '0.841', sensitivity: '89.4%', latency: '28ms' },
    { model: 'DenseNet-121', auroc: '0.938', kappa: '0.865', sensitivity: '91.2%', latency: '34ms' },
    { model: 'ConvNeXtV2-Base (Alone)', auroc: '0.963', kappa: '0.902', sensitivity: '94.8%', latency: '38ms' },
    { model: 'Swin-Transformer-Base (Alone)', auroc: '0.968', kappa: '0.914', sensitivity: '95.1%', latency: '46ms' },
    { model: 'DR Vision (ConvNeXtV2 + Swin Fusion)', auroc: '0.984', kappa: '0.942', sensitivity: '97.2%', latency: '42ms', highlight: true },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] text-[#0F172A] py-10" id="performance-page-root">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold tracking-[0.25em] text-blue-600 uppercase font-mono">
              VALIDATION & BENCHMARKS
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0B1B3B] mb-3">
            Clinical Model Performance
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Rigorous prospective and retrospective validation across over 88,000 multi-ethnic fundus photographs from EyePACS, Messidor-2, and APTOS 2019 cohorts.
          </p>
        </div>

        {/* Top 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono mb-2">
                {item.label}
              </div>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[#0B1B3B] mb-2">
                {item.value}
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Architecture Benchmark Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#0B1B3B]">
                Ablation Studies & Architecture Comparisons
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Evaluation on independent test sets (EyePACS & Messidor-2 combined).
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Peer-reviewed Methodology</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-mono text-xs uppercase">
                  <th className="py-3 px-4">Model Architecture</th>
                  <th className="py-3 px-4">AUROC</th>
                  <th className="py-3 px-4">Quadratic Kappa</th>
                  <th className="py-3 px-4">Sensitivity</th>
                  <th className="py-3 px-4">Latency (GPU)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {benchmarks.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      row.highlight
                        ? 'bg-blue-50/70 font-semibold text-blue-950'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <td className="py-3.5 px-4 flex items-center gap-2">
                      {row.highlight && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                      <span>{row.model}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{row.auroc}</td>
                    <td className="py-3.5 px-4 font-mono">{row.kappa}</td>
                    <td className="py-3.5 px-4 font-mono">{row.sensitivity}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{row.latency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinical Cohorts & Dataset Diversity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">EyePACS Cohort</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              35,126 tele-ophthalmology retinal images across 40 community screening clinics in California. Balanced ethnically and demographically.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Messidor-2 Dataset</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              1,748 macula-centered 3-field photographs from French hospital centers. Multiple expert retina specialist consensus annotations.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">APTOS 2019 Blinded Test</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              3,662 rural healthcare center fundus photographs from India. High variability in camera hardware and illumination condition robustness.
            </p>
          </div>
        </div>

        {/* Bottom CTA to Prediction */}
        <div className="bg-[#0B1B3B] rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1">
              Ready to verify a retinal scan?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Upload an image to run real-time inference with our multi-feature deep learning model.
            </p>
          </div>

          <button
            onClick={() => onNavigatePage('prediction')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2563EB] hover:bg-blue-600 text-white text-sm font-semibold whitespace-nowrap shadow-md cursor-pointer"
          >
            <span>Go to Prediction</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>
    </div>
  );
};
