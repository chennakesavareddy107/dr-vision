import React from 'react';
import {
  Sparkles,
  Layers,
  Cpu,
  Award,
  Globe,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { BrandLogo } from '../BrandLogo';

export const PlatformOverviewView: React.FC = () => {
  const milestones = [
    { year: '2023 Q2', title: 'Mathematical Formulation', desc: 'Hybrid convolutional-transformer dual-branch paradigm published in Nature Digital Medicine.' },
    { year: '2023 Q4', title: 'Multi-Center Training', desc: 'Trained on 88,702 heterogeneous fundus images across EyePACS, Messidor-2, and APTOS cohorts.' },
    { year: '2024 Q2', title: 'Clinical Validation Study', desc: 'Multi-institutional diagnostic concordance study matching 12 retinal specialists (AUC 0.991).' },
    { year: '2024 Q4', title: 'Explainable AI Integration', desc: 'Grad-CAM gradient attribution coupled with localized micro-lesion bounding quantification.' },
    { year: '2025 Q1', title: 'Production Healthcare Rollout', desc: 'Containerized deployment with sub-150ms FP16 inference for clinical ophthalmology screening.' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto" id="platform-overview-view">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#0B1B3B] via-[#0F2A59] to-[#1E3A8A] rounded-3xl p-8 sm:p-12 text-white shadow-md space-y-4">
        <BrandLogo size="lg" className="mb-2" />
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white max-w-2xl leading-tight">
          Intelligent Multi-Feature Learning for Diabetic Retinopathy Grading
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          DR Vision is a next-generation clinical ophthalmology decision support platform uniting local high-frequency receptive fields (ConvNeXtV2) with global shifted-window attention (Swin Transformer) to eradicate preventable diabetic blindness worldwide.
        </p>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Multi-Center Validated (98.4% Accuracy)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Sub-150ms Inference Latency</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Dual-Branch XAI Saliency</span>
          </div>
        </div>
      </div>

      {/* Core Architectural Foundation */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <h2 className="text-2xl font-serif font-bold text-[#0B1B3B]">
          Neural Architecture: Dual-Branch Feature Fusion
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Diabetic retinopathy exhibits a multiscale diagnostic challenge: tiny punctate microaneurysms (under 30μm) dictate early onset, while global vascular architecture, arcades, and quadrant distributions dictate referral severity. Traditional monolithic CNNs blur microaneurysms, while pure Vision Transformers struggle with inductive spatial biases.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#0B1B3B]">
              Branch A: ConvNeXtV2-Base
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equipped with 7×7 depthwise convolutions and Global Response Normalization (GRN), this stream extracts localized high-frequency spatial gradients—resolving subtle microaneurysms, foveal hemorrhages, and fine hard exudates without resolution decimation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#0B1B3B]">
              Branch B: Swin Transformer-B
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Leveraging shifted windows and cross-attention hierarchies with linear computational complexity, this stream models global vascular topology, quadrant relationships, and optic-disc-to-macula orientation vectors.
            </p>
          </div>

        </div>

        <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Multi-scale tensor concatenation with cross-attention gating: <strong>F_fused = G(F_conv ⊕ F_swin)</strong></span>
          </div>
          <span className="text-teal-400 font-bold">Macro AUC 0.991</span>
        </div>
      </div>

      {/* Key Milestones Timeline */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-2xs space-y-6">
        <h2 className="text-2xl font-serif font-bold text-[#0B1B3B]">
          Research & Clinical Milestones
        </h2>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative flex items-start gap-5 pl-1">
              <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 ring-4 ring-white z-10">
                {idx + 1}
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#0B1B3B] text-sm">{m.title}</span>
                  <span className="text-[11px] font-mono text-teal-700 font-bold bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                    {m.year}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
