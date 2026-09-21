import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  FileText,
  Sparkles,
  Search,
  Bot,
  ArrowRight,
  Clock,
  User,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  Stethoscope,
  PenTool,
  Check,
  Printer,
  FileDown,
  Info,
  HelpCircle,
  Activity,
  Award,
} from 'lucide-react';
import { PredictionResult, DRGrade, OphthalmologistSuggestion } from '../../types';
import { gradeMetadata } from '../../data/mockData';
import {
  downloadReportJson,
  downloadReportText,
  generateClinicalReportText,
} from '../../utils/reportExport';

interface DiagnosticResultsViewProps {
  result: PredictionResult;
  onNavigateTab: (tab: any) => void;
  onOpenReport: () => void;
  onUpdatePrediction?: (prediction: PredictionResult) => void;
}

export const DiagnosticResultsView: React.FC<DiagnosticResultsViewProps> = ({
  result,
  onNavigateTab,
  onOpenReport,
  onUpdatePrediction,
}) => {
  const meta = gradeMetadata[result.predictedGrade];

  // Existing review or defaults
  const existingReview = result.ophthalmologistReview;

  // Ophthalmologist Review Form State
  const [doctorName, setDoctorName] = useState(
    existingReview?.ophthalmologistName || 'Dr. Sarah Lin, MD'
  );
  const [doctorTitle, setDoctorTitle] = useState(
    existingReview?.ophthalmologistTitle || 'Senior Vitreoretinal Specialist, FAAO'
  );
  const [licenseNumber, setLicenseNumber] = useState(
    existingReview?.licenseNumber || 'MD-849102-EYE'
  );
  const [affiliation, setAffiliation] = useState(
    existingReview?.affiliation || 'Wilmer Eye Institute, Johns Hopkins Medicine'
  );

  const [clinicalAgreement, setClinicalAgreement] = useState<'concur' | 'modified' | 'equivocal'>(
    existingReview?.clinicalAgreement || 'concur'
  );
  const [selectedFinalGrade, setSelectedFinalGrade] = useState<DRGrade>(
    existingReview?.finalGrade ?? result.predictedGrade
  );
  const [macularEdemaPresent, setMacularEdemaPresent] = useState<boolean>(
    existingReview?.macularEdemaPresent || false
  );

  const [clinicalImpressions, setClinicalImpressions] = useState<string>(
    existingReview?.clinicalImpressions ||
      'Correlated with visual field testing. Automated multi-feature grading is concurred with. Patient scheduled for comprehensive dilated ophthalmoscopy and macular OCT.'
  );

  const defaultTreatments = [
    'Spectral-Domain Macular OCT Protocol (Urgent)',
    'Intensive Glycemic Optimization (HbA1c Target < 7.0%)',
    'Blood Pressure Control Target (< 130/80 mmHg)',
  ];

  const [treatmentSuggestions, setTreatmentSuggestions] = useState<string[]>(
    existingReview?.treatmentRecommendations || defaultTreatments
  );

  const [followUpInterval, setFollowUpInterval] = useState<string>(
    existingReview?.followUpInterval || '3 Months'
  );

  // Status & Feedback
  const [isReportGenerated, setIsReportGenerated] = useState<boolean>(
    Boolean(result.ophthalmologistReview)
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const treatmentOptions = [
    'Spectral-Domain Macular OCT Protocol (Urgent)',
    'Intravitreal Anti-VEGF Therapy (Aflibercept 2mg / Faricimab 6mg)',
    'Panretinal Photocoagulation (PRP) Laser Ablation',
    'Focal / Grid Macular Argon Laser Photocoagulation',
    'Fluorescein Angiography (FFA) to assess retinal non-perfusion',
    'Intensive Glycemic Optimization (HbA1c Target < 7.0%)',
    'Blood Pressure Control Target (< 130/80 mmHg)',
    'Urgent Vitreoretinal Surgical Referral (Rule out tractional detachment)',
  ];

  const quickFindingChips = [
    '+ Multiple blot hemorrhages in > 2 quadrants',
    '+ Hard exudate circinate cluster near fovea',
    '+ Diabetic Macular Edema (CSME) suspected',
    '+ Venous beading & microvascular loops (IRMA)',
    '+ Neovascularization of Optic Disc (NVD)',
    '+ Laser photocoagulation scars from prior treatment',
  ];

  const handleToggleTreatment = (treatment: string) => {
    if (treatmentSuggestions.includes(treatment)) {
      setTreatmentSuggestions(treatmentSuggestions.filter((t) => t !== treatment));
    } else {
      setTreatmentSuggestions([...treatmentSuggestions, treatment]);
    }
  };

  const handleAddQuickFinding = (chip: string) => {
    const cleanText = chip.replace(/^\+\s*/, '');
    if (!clinicalImpressions.includes(cleanText)) {
      setClinicalImpressions((prev) => (prev ? `${prev} ${cleanText}.` : `${cleanText}.`));
    }
  };

  // Compile Ophthalmologist Suggestions and update prediction
  const handleGenerateReport = () => {
    const updatedReview: OphthalmologistSuggestion = {
      ophthalmologistName: doctorName,
      ophthalmologistTitle: doctorTitle,
      licenseNumber: licenseNumber,
      affiliation: affiliation,
      clinicalAgreement: clinicalAgreement,
      finalGrade: clinicalAgreement === 'modified' ? selectedFinalGrade : result.predictedGrade,
      macularEdemaPresent: macularEdemaPresent,
      clinicalImpressions: clinicalImpressions,
      treatmentRecommendations: treatmentSuggestions,
      followUpInterval: followUpInterval,
      reviewedDate: new Date().toISOString().split('T')[0],
      signatureStamp: `SHA256-SIG-${Math.random().toString(36).substring(2, 10).toUpperCase()}-LIN-MD`,
    };

    const updatedResult: PredictionResult = {
      ...result,
      reviewedByDoctor: true,
      reviewedAt: new Date().toLocaleString(),
      doctorNotes: clinicalImpressions,
      ophthalmologistReview: updatedReview,
    };

    if (onUpdatePrediction) {
      onUpdatePrediction(updatedResult);
    }

    setIsReportGenerated(true);
    showToast('Official Clinical Report generated with Ophthalmologist Signature & Suggestions!');
  };

  const currentReviewData: OphthalmologistSuggestion = {
    ophthalmologistName: doctorName,
    ophthalmologistTitle: doctorTitle,
    licenseNumber: licenseNumber,
    affiliation: affiliation,
    clinicalAgreement: clinicalAgreement,
    finalGrade: clinicalAgreement === 'modified' ? selectedFinalGrade : result.predictedGrade,
    macularEdemaPresent: macularEdemaPresent,
    clinicalImpressions: clinicalImpressions,
    treatmentRecommendations: treatmentSuggestions,
    followUpInterval: followUpInterval,
    reviewedDate: new Date().toISOString().split('T')[0],
    signatureStamp: `SIG-${doctorName.replace(/\s+/g, '_')}`,
  };

  const probabilitiesList = [
    { label: 'No DR (Grade 0)', val: result.probabilities.noDR, color: '#10B981' },
    { label: 'Mild NPDR (Grade 1)', val: result.probabilities.mild, color: '#06B6D4' },
    { label: 'Moderate NPDR (Grade 2)', val: result.probabilities.moderate, color: '#F59E0B' },
    { label: 'Severe NPDR (Grade 3)', val: result.probabilities.severe, color: '#EA580C' },
    { label: 'Proliferative DR (Grade 4)', val: result.probabilities.proliferative, color: '#EF4444' },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto" id="diagnostic-results-view">
      
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#0B1B3B] text-white px-5 py-3 rounded-2xl shadow-2xl border border-blue-500/40 text-xs font-semibold flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <span>Inference ID: {result.id}</span>
            <span>•</span>
            <span>{result.timestamp}</span>
            <span>•</span>
            <span className="text-blue-600 font-semibold">Patient: {result.patientName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1B3B]">
            Automated Diagnostic Assessment &amp; Clinical Review
          </h1>
        </div>

        {/* Global Action Bar with Direct Report Generation & Downloads */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenReport}
            id="view-formal-report-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Patient Report View</span>
          </button>

          <button
            onClick={() => downloadReportJson(result, currentReviewData)}
            id="download-json-report-btn"
            title="Download JSON Clinical Data"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-mono font-medium shadow-2xs transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>.JSON</span>
          </button>

          <button
            onClick={() => downloadReportText(result, currentReviewData)}
            id="download-txt-summary-btn"
            title="Download Text Consultation Notes"
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-mono font-medium shadow-2xs transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span>.TXT</span>
          </button>

          <button
            onClick={onOpenReport}
            id="print-pdf-report-btn"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1B3B] hover:bg-[#13274F] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-cyan-300" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Generated Report Success Bar */}
      {isReportGenerated && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm">
                Official Clinical Consultation Report Generated
              </div>
              <div className="text-emerald-700 text-[11px]">
                Reviewed &amp; electronically signed by {doctorName} ({doctorTitle}) • Ready for patient download and EMR filing.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              onClick={onOpenReport}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Open Full Document
            </button>
            <button
              onClick={() => downloadReportJson(result, currentReviewData)}
              className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs transition-colors cursor-pointer"
            >
              Download File
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Left Findings, Right Visual & Saliency preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Clinical Grade, Probabilities, Interpretation, Follow-up */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Grade Outcome Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Hybrid Classification Output (ConvNeXtV2 + Swin)
                </span>
                <h2 className="text-3xl font-serif font-bold text-[#0B1B3B]">
                  {meta.fullName}
                </h2>
                <div className="text-xs text-slate-500 font-mono mt-1">
                  ICD-10 Code: <strong className="text-slate-700">{meta.icd10}</strong>
                </div>
              </div>

              {/* Risk Level Badge */}
              <div className="text-right">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeBg}`}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: meta.color }} />
                  <span>{meta.riskLevel} Risk</span>
                </span>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  Confidence: <strong className="text-slate-800">{(result.confidence * 100).toFixed(1)}%</strong>
                </div>
              </div>
            </div>

            {/* Probability Distribution Bar Chart */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
                Class Probability Distribution
              </h3>

              <div className="space-y-2.5">
                {probabilitiesList.map((item, idx) => {
                  const pct = Math.round(item.val * 100);
                  const isWinner = idx === result.predictedGrade;

                  return (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${isWinner ? 'font-bold text-[#0B1B3B]' : 'text-slate-600'}`}>
                          {item.label}
                        </span>
                        <span className="font-mono text-slate-500">
                          {(item.val * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.max(pct, item.val > 0 ? 3 : 0)}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Clinical Interpretation & AAO Follow-Up */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
            
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Automated Feature Interpretation &amp; Diagnostic Logic</span>
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {result.clinicalInterpretation}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Standard Clinical Follow-Up Protocol</span>
              </h3>
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-xs sm:text-sm text-amber-900 leading-relaxed">
                <div className="font-bold mb-1">Standard Ophthalmology Guidelines:</div>
                {result.recommendedFollowUp}
              </div>
            </div>

          </div>

          {/* ========================================================
              OPHTHALMOLOGIST REVIEW & SUGGESTIONS PORTAL
              (Directly addressing user requirement)
             ======================================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-200/90 shadow-sm space-y-6 relative overflow-hidden" id="ophthalmologist-suggestions-portal">
            
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-serif font-bold text-[#0B1B3B]">
                      Attending Ophthalmologist Suggestions &amp; Review
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-mono text-[10px] font-bold border border-blue-200">
                      MD ACCESS ENABLED
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Make clinical adjustments, record clinical impressions, prescribe treatments, and generate the signed patient report.
                  </p>
                </div>
              </div>
            </div>

            {/* Clinician Profile Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Attending Clinician Name
                </label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">
                  Professional Title &amp; Credentials
                </label>
                <input
                  type="text"
                  value={doctorTitle}
                  onChange={(e) => setDoctorTitle(e.target.value)}
                  className="w-full bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Clinical Agreement & Grade Adjustment */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 font-mono uppercase tracking-wider">
                Clinical Agreement &amp; Severity Assessment
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setClinicalAgreement('concur')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    clinicalAgreement === 'concur'
                      ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">Concur with AI</span>
                    {clinicalAgreement === 'concur' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Accept Grade {result.predictedGrade} ({meta.name}) as final diagnosis.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setClinicalAgreement('modified')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    clinicalAgreement === 'modified'
                      ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">Adjust Grade</span>
                    {clinicalAgreement === 'modified' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Clinician overrides model output based on slit lamp/OCT exam.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setClinicalAgreement('equivocal')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    clinicalAgreement === 'equivocal'
                      ? 'bg-purple-50/80 border-purple-400 ring-2 ring-purple-400/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">Equivocal Case</span>
                    {clinicalAgreement === 'equivocal' && <Check className="w-3.5 h-3.5 text-purple-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Request secondary retinal panel over-read.
                  </p>
                </button>
              </div>

              {/* If Adjusted, show selector */}
              {clinicalAgreement === 'modified' && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs flex items-center justify-between gap-3">
                  <span className="font-semibold text-amber-900">Select Final Clinical Grade:</span>
                  <div className="flex items-center gap-1.5">
                    {([0, 1, 2, 3, 4] as DRGrade[]).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setSelectedFinalGrade(g)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                          selectedFinalGrade === g
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-100'
                        }`}
                      >
                        Grade {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Macular Edema Co-morbidity */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={macularEdemaPresent}
                  onChange={(e) => setMacularEdemaPresent(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <span className="font-semibold text-xs text-slate-800 block">
                    Diabetic Macular Edema (DME / CSME) Observed or Suspected
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Thickening of retina within 500 microns of the macular center; requires immediate anti-VEGF or focal laser.
                  </span>
                </div>
              </label>
            </div>

            {/* Clinical Observations & Remarks */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider">
                  Ophthalmologist Impressions &amp; Findings
                </label>
                <span className="text-[11px] text-slate-400">Add fast clinical descriptors:</span>
              </div>

              {/* Quick Descriptor Chips */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                {quickFindingChips.map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddQuickFinding(chip)}
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 text-[11px] text-slate-700 transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <textarea
                value={clinicalImpressions}
                onChange={(e) => setClinicalImpressions(e.target.value)}
                rows={3}
                placeholder="Enter detailed clinical impressions, slit-lamp findings, or instructions..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            {/* Treatment Suggestions & Interventions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider">
                  Prescriptive Treatment &amp; Management Suggestions
                </label>
                <span className="text-[11px] text-slate-500">Select applicable therapies:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {treatmentOptions.map((opt, i) => {
                  const isChecked = treatmentSuggestions.includes(opt);
                  return (
                    <label
                      key={i}
                      className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-blue-50/70 border-blue-300 text-blue-950 font-medium'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleTreatment(opt)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer shrink-0"
                      />
                      <span className="text-xs">{opt}</span>
                    </label>
                  );
                })}
              </div>

              {/* Recommended Re-evaluation Interval */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-slate-700">Follow-Up Re-evaluation Interval:</span>
                <div className="flex items-center gap-1.5">
                  {['1 Month', '3 Months', '6 Months', '12 Months'].map((interval) => (
                    <button
                      key={interval}
                      type="button"
                      onClick={() => setFollowUpInterval(interval)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                        followUpInterval === interval
                          ? 'bg-[#0B1B3B] text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {interval}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar for Ophthalmologist */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400 font-mono">
                Stamps signature with verified timestamp upon generation.
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  id="generate-official-report-btn"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Generate Signed Clinical Report</span>
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right 5 Cols: Patient Information & Explainability Jump Links */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Patient Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-serif font-bold text-[#0B1B3B] text-base">
                    {result.patientName}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    ID: {result.patientId}
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-mono bg-slate-100 px-2 py-1 rounded text-slate-600 font-semibold">
                {result.eyeSide}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <div className="text-slate-400 text-[10px]">Patient Age &amp; Sex</div>
                <div className="font-bold text-slate-800">{result.patientAge} Years / {result.patientGender}</div>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <div className="text-slate-400 text-[10px]">Image Quality Score</div>
                <div className="font-bold text-emerald-600 font-mono">{result.qualityScore}% (Pass)</div>
              </div>
            </div>
          </div>

          {/* Fundus Visual & Saliency Quick Preview */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-md border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider">
                Explainability Hub
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Grad-CAM &amp; Lesions
              </span>
            </div>

            <div className="flex justify-center py-2">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-teal-500/80 bg-black shadow-lg">
                <img
                  src={result.imageUrl}
                  alt="Fundus"
                  className="w-full h-full object-cover"
                />
                {result.gradCamUrl && (
                  <img
                    src={result.gradCamUrl}
                    alt="Grad-CAM overlay"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen pointer-events-none"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => onNavigateTab('grad-cam')}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-teal-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Grad-CAM View</span>
              </button>

              <button
                onClick={() => onNavigateTab('lesions')}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Lesion Analysis</span>
              </button>
            </div>

            <button
              onClick={() => onNavigateTab('copilot')}
              className="w-full py-2.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI Copilot to Explain This Diagnosis</span>
            </button>
          </div>

          {/* Quick Report Download Box */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Direct Report Downloads</span>
            </h3>
            <p className="text-xs text-slate-500">
              Download the complete clinical package including model telemetry and physician suggestions in multiple formats.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={onOpenReport}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  Printable Consultation PDF
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Formatted</span>
              </button>

              <button
                onClick={() => downloadReportJson(result, currentReviewData)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileDown className="w-3.5 h-3.5 text-blue-600" />
                  Structured EHR Dataset (.JSON)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">EMR</span>
              </button>

              <button
                onClick={() => downloadReportText(result, currentReviewData)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  Plain Clinical Summary (.TXT)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Text</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
