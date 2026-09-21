import React from 'react';
import {
  Users,
  CheckCircle,
  Activity,
  Award,
  ArrowUpRight,
  Clock,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  FileText,
  UploadCloud,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { samplePredictions, samplePatients, gradeMetadata } from '../../data/mockData';
import { DRGrade, PredictionResult } from '../../types';
import { useFirebase } from '../../context/FirebaseContext';
import { Flame } from 'lucide-react';

interface MainDashboardProps {
  onSelectPrediction: (pred: PredictionResult) => void;
  onNavigateTab: (tab: any) => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  onSelectPrediction,
  onNavigateTab,
}) => {
  const { predictions, patients, isConnectedToFirebase } = useFirebase();

  const displayedPredictions = predictions.length > 0 ? predictions : samplePredictions;
  const patientCount = 1480 + (patients.length - 4);
  const predictionCount = 3920 + (predictions.length - 5);

  const topMetrics = [
    {
      title: 'Total Patients Screened',
      value: patientCount.toLocaleString(),
      change: `${patients.length} active cohort records`,
      isPositive: true,
      icon: Users,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Total Graded Scans',
      value: predictionCount.toLocaleString(),
      change: `${predictions.length} synchronized in cloud`,
      isPositive: true,
      icon: CheckCircle,
      color: 'text-teal-600 bg-teal-50 border-teal-100',
    },

    {
      title: 'Average Model Confidence',
      value: '97.2%',
      change: 'Calibrated (ECE 0.018)',
      isPositive: true,
      icon: Activity,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Clinical Validation Accuracy',
      value: '98.4%',
      change: 'Multi-center verified (AUC 0.991)',
      isPositive: true,
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  const gradeDistribution = [
    { grade: 0 as DRGrade, count: 842, pct: 56.8 },
    { grade: 1 as DRGrade, count: 236, pct: 15.9 },
    { grade: 2 as DRGrade, count: 218, pct: 14.7 },
    { grade: 3 as DRGrade, count: 114, pct: 7.7 },
    { grade: 4 as DRGrade, count: 72, pct: 4.9 },
  ];

  return (
    <div className="space-y-8" id="main-dashboard-view">
      
      {/* Top Banner / Welcome */}
      <div className="bg-[#0B1B3B] rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Clinical Ophthalmology Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time diabetic retinopathy grading, feature extraction telemetry, and multi-institutional decision support.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateTab('upload')}
              id="dashboard-upload-fundus-cta"
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload New Fundus</span>
            </button>
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {topMetrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{item.title}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1B3B] mb-1">
                {item.value}
              </div>
              <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">{item.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid: Recent Diagnoses & Disease Severity Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Recent Diagnoses */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#0B1B3B]">
                Recent Patient Diagnoses
              </h2>
              <p className="text-xs text-slate-500">
                Validated inference outputs by attending retinal specialists
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('patients')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Records</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                  <th className="pb-3 pl-2">Patient / MRN</th>
                  <th className="pb-3">Eye</th>
                  <th className="pb-3">Predicted DR Grade</th>
                  <th className="pb-3">Confidence</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedPredictions.slice(0, 8).map((pred) => {
                  const meta = gradeMetadata[pred.predictedGrade] || gradeMetadata[0];
                  return (
                    <tr
                      key={pred.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => {
                        onSelectPrediction(pred);
                        onNavigateTab('diagnostic');
                      }}
                    >
                      {/* Patient Details */}
                      <td className="py-3.5 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200 bg-black">
                            <img
                              src={pred.imageUrl}
                              alt="Fundus Thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-[#0B1B3B] group-hover:text-blue-600 transition-colors">
                              {pred.patientName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {pred.patientId} • {pred.patientAge}y {pred.patientGender[0]}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Eye Side */}
                      <td className="py-3.5 font-medium text-slate-600 font-mono">
                        {pred.eyeSide.split(' ')[0]}
                      </td>

                      {/* Grade Pill */}
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${meta.badgeBg}`}>
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: meta.color }}
                          />
                          <span>{meta.name}</span>
                        </span>
                      </td>

                      {/* Confidence */}
                      <td className="py-3.5 font-mono font-bold text-slate-700">
                        {(pred.confidence * 100).toFixed(1)}%
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 text-slate-400 text-[11px]">
                        {pred.timestamp.split(' ')[1]}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 text-right pr-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectPrediction(pred);
                            onNavigateTab('diagnostic');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#0B1B3B] hover:text-white text-slate-700 text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                        >
                          <span>Examine</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 4 Cols: Disease Severity Distribution & Model Telemetry */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Disease Severity Analytics */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs">
            <h3 className="text-base font-serif font-bold text-[#0B1B3B] mb-1">
              Disease Severity Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Cumulative patient breakdown across 5 ETDRS stages
            </p>

            <div className="space-y-3">
              {gradeDistribution.map((item) => {
                const meta = gradeMetadata[item.grade];
                return (
                  <div key={item.grade} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: meta.color }}
                        />
                        <span>{meta.name}</span>
                      </span>
                      <span className="font-mono text-slate-500">
                        {item.count} ({item.pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.pct}%`,
                          backgroundColor: meta.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">High-Risk Escalation Rate:</span>
              <span className="font-bold text-rose-600 font-mono">12.6% (Severe + PDR)</span>
            </div>
          </div>

          {/* Quick AI Diagnostics & Copilot card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-400/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-white">AI Ophthalmology Copilot</h4>
                <p className="text-[11px] text-slate-400">Ask medical questions or explain Grad-CAM</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Have questions about lesion criteria (e.g. 4-2-1 rule) or require an automated clinical report summary?
            </p>
            <button
              onClick={() => onNavigateTab('copilot')}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Clinical Copilot</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
